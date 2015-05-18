var nodeDragging = false;
var nodeClicked = false;
var fps = 0;
var currentShape = null;

function d3graph(element)
{

	this.enableForce = true;
 
 	zoom = d3.behavior.zoom().scaleExtent([0.05, 5]).on("zoom", zoomed);


    var vis = this.vis = d3.select(element).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("id","visualizerInner")
		.call(zoom).on("dblclick.zoom", null);

	var rect = vis.append("rect")
		.attr("width", width)
		.attr("height", height)
		.style("fill", "none")
		.style("pointer-events", "all")
		.style("cursor","default");
 
	container = vis.append("g");

    var force = d3.layout.force()
    	.charge(preferences.appearanceCharge)
		.gravity(0.1)
		.linkDistance(preferences.appearanceLinkDistance)
		.linkStrength(preferences.appearanceLinkStrength/100)
		.friction(preferences.appearanceFriction/100)
        .size([width, height]);

	var color = d3.scale.linear()
	    .domain([ 0, 10])
	    .range(["green", "red"]);
		    

    var drag = force.drag()
		.on("dragstart", dragstarted)	 
		.on("drag", dragged)
		.on("dragend", dragended);

    var nodes = force.nodes(),
        links = force.links();
 		 
    fpsf = null;
    fpsf = setInterval(function () { ffps = fps;   fps=0; }, 1000);


	/*--------------------------*/
	/*----------UPDATE----------*/
	/*--------------------------*/
	/*--------------------------*/
	/*--------------------------*/

    var update = function () 
    {

 
  		textVisibillity =  preferences.appearanceShowText=="true" ? "visible": "hidden";
		linksVisibillity = preferences.appearanceShowLinks=="true" ? "visible" : "hidden";
	 
    	force.charge(preferences.appearanceCharge)
			.gravity(0.1)
			.linkDistance(preferences.appearanceLinkDistance)
			.linkStrength(preferences.appearanceLinkStrength/100)
			.friction(preferences.appearanceFriction/100)
	        .size([width, height]);

        var color = d3.scale.linear()
		    .domain([ 0, 10])
		    .range(["green", "red"]);

        d3.select('#visualizerInner') 
	   		.attr('width', width)
	   		.attr('height', height)

        var node = container.selectAll(".node")
            .data(nodes);
 
        var link = container.selectAll(".link")
            .data(links );

        var linkEnter = link.enter().append("line")
            .attr("class", "link")
            .style("visibility",linksVisibillity);

        var nodeEnter = node.enter().append("g")
	        .attr("class", "node")
	        .attr("class",function(d){return d.type})
	        .attr("id",function(d){return d.index;})
	        .call(force.drag);

 
    	nodeEnter.filter(function(d) { return d.type.search("Link")!=-1 })
	        .append("path")
      		.attr("d", d3.svg.symbol().type("triangle-up"))
	        .attr("class", "linkNode")
	        .attr("height", "5")
	        .attr("width", "5");

	    if (preferences.displayNodeShape == "circle")
	    {
	    	nodeEnter.filter(function(d) { return d.type.search("Link")==-1 })
		        .attr("fixed",function(d){return d.incoming.length > 5})
	    		.append("circle")
	    		.attr("class", "nodein")
		        .attr("fill",function(d){ return "" + color(d.incoming.length); })
		        .attr("x",function(d){return d.x})
		        .attr("y",function(d){return d.y})
		        .attr("r", nodeRadius);
 		}
 		else if (preferences.displayNodeShape=="rectangle")
 		{
 			nodeEnter.filter(function(d) { return d.type.search("Link")==-1 })
	    		.append("rect")
 				.attr("class", "nodein")
		        .attr("fill",function(d){ return "" + color(d.incoming.length); })
		        .attr("fixed",function(d){return d.incoming.length > 5})
		        .attr("x",function(d) { return (d.x - nodeRadius); })
		        .attr("y",function(d) { return (d.y - nodeRadius); })
		        .attr("width", nodeRadius)
		        .attr("height", nodeRadius);
 		}
 		else if(preferences.displayNodeShape=="triangle")
 		{
 			nodeEnter.filter(function(d) { return d.type.search("Link")==-1 })
		        .attr("fixed",function(d){return d.incoming.length > 5})
	    		.append("path")
 				.attr("class", "nodein")
	      		.attr("d", d3.svg.symbol().type("triangle-up"))
		        .attr("fill",function(d){ return "" + color(d.incoming.length); })
		        .attr("x",function(d){return d.x})
		        .attr("y",function(d){return d.y})
		        .attr("r", nodeRadius);
 		}
 		else if(preferences.displayNodeShape=="none")
 		{
 		}

        text = nodeEnter.append("text")
	        .attr("class", "text")
	        .attr("class",function(d) { if (d.type.search("Link")!=-1) return "textLink text"; else return "text"; })
	        .style("visibility",textVisibillity)
	        .text(function(d){return nodeName(d,false);});

        link.exit().remove();
        node.exit().remove();

        force.on("tick", function() 
        {
        	 

	        if (preferences.appearanceShowLinks)
	        {
	          link
	          .attr("x1", function(d) { return d.source.x; })
	          .attr("y1", function(d) { return d.source.y; })
	          .attr("x2", function(d) { return d.target.x; })
	          .attr("y2", function(d) { return d.target.y; });
			}  

          	node.attr("transform", function(d) { 

	        if (String2Boolean(preferences.displayShowLinkHandles))
	         	return "translate(" + d.x + "," + d.y + ")"; 
	        else
	        {
		        if (d.type.search("Link")==-1)
		         	return "translate(" + d.x + "," + d.y + ")";          	
	        }

          });
           
           
          fps++;
        });
 
	    /*------------------------------------*/
		/*---------------EVENTS---------------*/
		/*------------------------------------*/
		/*------------------------------------*/
		/*------------------------------------*/
		rect.on("mouseover", function(d) 
		{
			if ((preferences.selectedTool == "Highlight"))
			{
				link.transition(transitionSpeed).duration(transitionSpeed).style("stroke-opacity", 1);
				node.transition(transitionSpeed).duration(transitionSpeed).style("opacity", 1);
			}
		});

		text.on("click",function(d)
		{
			if (d3.select(this).classed("fullName")==false)
			{
				d3.select(this).text(function(d){return nodeName(d,true)});
				d3.select(this).classed("fullName",true);
			}
			else
			{
				d3.select(this).text(function(d){return nodeName(d,false)});
				d3.select(this).classed("fullName",false);	
			}
		});

		vis.on("mouseup", function(d) 
		{
			//if (dragging) return;

			selectedNode = null;
			clearAtomDetails();
			if (preferences.selectedTool == "pointer")
			{
				//d3.select(this).select("circle").transition().duration(transitionSpeed).attr("r", nodeRadius);
				node.classed("selectedNode",false);
				link.transition(transitionSpeed).duration(transitionSpeed).style("stroke-opacity", 0.8);
				node.transition(transitionSpeed).duration(transitionSpeed).style("opacity", 1);
				connectedNode.splice(0, connectedNode.length);
			}
			else if (preferences.selectedTool == "addNode")
			{
				atomis = defaultAtom();
 		 
				$.ajax(
				{
					url: preferences.cogserver + 'api/v1.1/atoms',
					type: 'OPTIONS',
					data: atomis	
				})
				.success(function(data)
				{
					atomis["x"] = d3.mouse(this)[0];
					atomis["y"] = d3.mouse(this)[1];
					d3g.addNode(atomis);
				})
				.fail(function(data)
				{
					//Failed
					atomis["x"] = d3.mouse(this)[0];
					atomis["y"] = d3.mouse(this)[1];
				});	
			}
		});

		link.on("click", function(d) 
		{
			 
			if (preferences.selectedTool == "removeLink")
			{
				d3g.removeLink(d.index);
				return;
			}

			if (dragging) return;
			selectedLink = d;
			showSelectedLink(d);

			linkEnter.classed("selectedLink",false);
			d3.select(this).classed("selectedLink",true);
		});
		
		node.on("dblclick", function(d)
		{

			if (d.fixed==0)
			{
				d3.select(this).classed("fixed",true);
				$("#atomDetailsFixed").switchButton({ checked: true });
				d.fixed = true;
			}
			else
			{
				$("#atomDetailsFixed").switchButton({ checked: false });
				d3.select(this).classed("fixed",false);
				d.fixed =false;
			}
		});
		 
		node.on("click",function(d)
		{

	 	 	if (preferences.selectedTool == "pointer")
			{
 
				if (d!=selectedNode)
				{
					selectedNode = d;
					showSelectedAtom(d);
			 		atomDetailsChanged = false;
			 		$("#atomDetailsUpdate").prop("disabled",true);
			 		$("#atomDetailsDelete").prop("disabled",false);
	 			}

			}
			else if (preferences.selectedTool == "removeNode")
			{
				deleteNode(d);
				return;
			}
			else if (preferences.selectedTool == "addLink")
			{

				if (linkToolNode1 == null)
				{
					d3.select(this).classed("linkToolNode",true);
					linkToolNode1 = d.index;
				 
					return;
				}
				else
				{ 
					linkToolNode2 = d.index;				 
					node.classed("linkToolNode",false);
					d3g.addLink(linkToolNode1, linkToolNode2 ) ;
					linkToolNode1 = null;
					linkToolNode2 = null;
					return;
				}
			}
			else if (preferences.selectedTool == "removeLink")
			{

			}

			d3.event.stopPropagation();
			node.classed("selectedNode",false);
			link.classed("selectedLink",false);
			d3.select(this).classed("selectedNode",true);
			if (atomDetailsChanged && d!=selectedNode)
			{
				if ( !confirm("Are you sure you want to select other atom without updating it's settings?") )
					return;
			}
			 
			var dcx = (width / 2 - d.x * zoom.scale());
			var dcy = (height / 2 - d.y * zoom.scale());
			/*zoom.translate([dcx, dcy]);
			container.transition()
			.duration(transitionSpeed)
			.attr("transform", "translate(" + dcx + "," + dcy + ")scale(" + zoom.scale() + ")");
			*/

		});

		node.on("mouseover", function(d)
		{
 
			if ((preferences.selectedTool == "Highlight"))
			{
				node.transition(transitionSpeed).duration(transitionSpeed).style("opacity", function(o)
				{
					return isConnected(d, o) ? 1.0 : 0.1;
				})
	 
				link.transition(transitionSpeed).duration(transitionSpeed).style("stroke-opacity", function(o)
				{
					for ( j = 0; j < connectedNode.length; j++) 
					{
						if (connectedNode[j].handle == o.source.handle)
							return 1.0;
						if (connectedNode[j].handle == o.target.handle)
							return 1.0;
					}
					return 0.1;
				});
				return;
			}

			if ((preferences.selectedTool == "addLink") && (linkToolNode1!=null))
			{
				d3.select(this).classed("linkToolNode",true);
				return;
			}
		 
		})

		node.on("mouseout", function(d)
		{
			node.classed("node-active", false);
			link.classed("link-active", false);
			d3.select(this).select("circle").transition().duration(transitionSpeed).attr("r", nodeRadius);
			connectedNode.splice(0, connectedNode.length);
		});

		force.start(); 
	    drawedd3 = true;
	    
    }

    update();
 	
	/*--------------------------*/
	/*--------FUNCTIONS---------*/
	/*--------------------------*/
	/*--------------------------*/
	/*--------------------------*/
 
 	this.showAll = function()
 	{
 		//this.link.transition(transitionSpeed).duration(transitionSpeed).style("stroke-opacity", 1);
		//this.node.transition(transitionSpeed).duration(transitionSpeed).style("opacity", 1);
 	}

	this.updateForce = function()
	{

		force.charge(preferences.appearanceCharge)
			.gravity(0.1)
			.linkDistance(preferences.appearanceLinkDistance)
			.linkStrength(preferences.appearanceLinkStrength/100)
			.friction(preferences.appearanceFriction/100)
	        .size([width, height]);

	    force.start();
	}

    this.addNodes = function(newnodes) 
	{
		
        if (newnodes==null)return;

        for(var i=0;i<newnodes.length;i++)
        	nodes.push(newnodes[i]);	
 
        this.refreshLinks();

        update();
    }

    this.refreshLinks = function ()
    {
    	for(var i=0;i<nodes.length;i++)
        {
	    	for (var li=0;li<nodes[i].incoming.length;li++)
	    	{
	    		if(findNodeByHandle(nodes[i].incoming[li]))
	    			links.push({"source": nodes[i], "target": findNodeByHandle(nodes[i].incoming[li]), "index": links.length});
	    	}
	    	for (var lo=0;lo<nodes[i].outgoing.length;lo++)
	    	{
	    		if(findNodeByHandle(nodes[i].outgoing[lo]))
	    			links.push({"source": findNodeByHandle(nodes[i].outgoing[lo]), "target": nodes[i], "index": links.length});
	    	}
    	}
    }

	this.addNode = function (newnode) 
	{
        nodes.push(newnode);
        update();
    }

    this.removeNode = function (id) 
    {
        var i = 0;
        var n = findNode(id);
        while (i < links.length) 
        {
            if ((links[i]['source'] === n)||(links[i]['target'] == n)) 
            	links.splice(i,1);
            else i++;
        }
        var index = findNodeIndex(id);
        if(index !== undefined) 
        {
            nodes.splice(index, 1);
            update();
        }
    }

    this.addLink = function (sourceId, targetId) 
    {
        var sourceNode = findNode(sourceId);
        var targetNode = findNode(targetId);
        
        if((sourceNode !== null) && (targetNode !== null)) 
        {
            links.push({"source": sourceNode, "target": targetNode, "index": links.length});
            update();
        }
        else
        	echo("One of the connecting links have not been found");
    }
    
    this.removeLink = function (index) 
    {
        links.splice(index,1);
        update();
    }

    this.update = function ()
    {
    	links = [];
    	nodes = [];
    }
    this.stop = function()
    {
    	force.stop();
    }

    this.showFullText = function()
    {
    	d3.selectAll(".text").classed("fullName",true).text(function(d){return nodeName(d,true)}) ;
    } 

 	this.showAbbrevatedText = function()
    {
    	d3.selectAll(".text").classed("fullName",false).text(function(d){return nodeName(d,false)}) ;
    }

    this.animate = function()
    {
    
    }
    
   
	this.updateDisplay = function()
    {
    	if (currentShape!=preferences.displayNodeShape)
    	{
    		d3.selectAll(".nodein").remove();
    		d3.selectAll(".node").append("circle").attr("class","nodein").attr("r",nodeRadius);
    		currentShape = preferences.displayNodeShape;
    	}
 		
 		if (String2Boolean(preferences.textShowLinkTypeName)==true)
    		d3.selectAll(".textLink").style("display","block");
    	else
    		d3.selectAll(".textLink").style("display","none");
		
		rect.style("background-color",preferences.ColorBackgroundColor)
			.attr("fill",preferences.ColorBackgroundColor);

		d3.select("#screen-d3").style("background-color",preferences.ColorBackgroundColor)
			.attr("fill",preferences.ColorBackgroundColor);

    	d3.selectAll(".nodein").transition().duration(transitionSpeed)
	    	.attr("r", nodeRadius)
	    	.attr("width", nodeRadius)
	    	.attr("height", nodeRadius);

	    //COLORS
	    if ($("#ColorColorMethod").val()=="simple")	
	    	d3.selectAll(".nodein").attr("fill",preferences.ColorSimpleColor)	
    	
     	d3.selectAll(".nodein").style("opacity",preferences.colorSimpleTransparency/100);

    }

    this.changeColor = function()
    {

    }

    var findNodeByHandle = function (handle) 
    {
        for (var i=0; i < nodes.length; i++) 
        {
            if (nodes[i].handle ===(handle))
                return nodes[i]
        };
        return null;
    }

    var findNode = function (id) 
    {
        for (var i=0; i < nodes.length; i++) 
        {
            if (nodes[i].index ===(id))
                return nodes[i]
        };
        return null;
    }

    var findNodeIndex = function (id) 
    {
        for (var i=0; i < nodes.length; i++) 
        {
            if (nodes[i].index ===(id))
                return i
        };
        return null;
    }

	/*------------------------------------*/
	/*-------VARIOUS FUNCTIONS(?)---------*/
	/*------------------------------------*/
	/*------------------------------------*/
	/*------------------------------------*/
	 

    function nodeRadius(d)
    {
    	
    	if (preferences.radiusBased=="Incoming")
    	{
	    	if (d.incoming!=undefined)
	    	{
		    	if (d.name!="")
		    		return d.incoming.length * (preferences.displayRadiusMultiplier/10) + 2;
		    	else
		    		return 1;
	    	}
	    	return 10;
	    }
    	else if (preferences.radiusBased=="Outgoing")
    	{
    		if (d.outgoing!=undefined)
	    	{
		    	if (d.name!="")
		    		return d.outgoing.length * (preferences.displayRadiusMultiplier/10) + 2;
		    	else
		    		return 1;
	    	}
	    	return 10;
    	}
    	else if (preferences.radiusBased=="IncomingOutgoing")
    	{
    		if (d.name!="")
		    		return (d.outgoing.length + d.incoming.length) * (preferences.displayRadiusMultiplier/10) + 2;
		    	else
		    		return 1;
    	}
    	else if (preferences.radiusBased=="AtomType")
    	{
    		return preferences.displayRadiusMultiplier;
    	}
    	else if (preferences.radiusBased=="Fixed")
    	{
    		return preferences.displayRadiusMultiplier;
    	}
    	else if (preferences.radiusBased=="Random")
    	{
    		return Math.random() * preferences.displayRadiusMultiplier;
    	}
    	else if (preferences.radiusBased=="sti")
    	{
    		return  d.attentionvalue.sti * preferences.displayRadiusMultiplier;
    	}
    	else if (preferences.radiusBased=="lti")
    	{
    		return  d.attentionvalue.lti * preferences.displayRadiusMultiplier;
    	}
     

    }
    function nodeName(d,full)
    {
    	if (full)
    	{
	    	if (d.name!="") return d.name;
	    	else if (d.type!="") return d.type;
	    	else
	    	if(d.type.search("Link")==-1) return d.handle;
    	}
    	else
    	{
	    	if (d.name!="") return d.name.substring(0,10);
	    	else if (d.type!="") return d.type.substring(0,10);
	    	else
	    	if(d.type.search("Link")==-1) return d.handle.substring(0,10);
	    }
    }



 
    function zoomed()
	{
		container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	}

	function dragstarted(d)
	{
		d3.event.sourceEvent.stopPropagation();
		nodeDragging = true;
		//console.log("dragStarted");
	}

	function dragged(d)
	{
		//d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
		nodeDragging = true;
	}

	function dragended(d)
	{
		nodeDragging = false;
		//console.log("Drag Ended");
	}

	function arrycontain(obj) 
	{
		var i = connectedNode.length;
		while (i--)
		{
			if (connectedNode[i] === obj) 
				return true;
		}
		return false;
	}

	function getnode(handle) 
	{
		for ( jnode = 0; jnode < atomData.length; jnode++)
			if (handle == atomData[jnode].handle)
				return atomData[jnode];
	}

	function isConnected(a, b) 
	{

		if (!arrycontain(a))
			connectedNode[connectedNode.length] = a;
 
		function recurse(node)
		{
			if (node.incoming.length > 0)
				node.incoming.forEach(function(entry)
				{
					//finde better way
					var currentNde = getnode(entry);
					if (!arrycontain(currentNde)) {
						connectedNode[connectedNode.length] = currentNde;
						recurse(currentNde);
					}
				});
			
			if (node.outgoing.length > 0)
				node.outgoing.forEach(function(entry)
				{
					//finde better way
					var currentNde = getnode(entry);
					if (!arrycontain(currentNde)) {
						connectedNode[connectedNode.length] = currentNde;
						recurse(currentNde);
					}
				});
 
		}

		recurse(a);

		if (!arrycontain(b))
			return false;
		else
			return true;
	}



	// Returns a list of all nodes under the root.
	function flatten(root) {
	  var nodes = [], i = 0;

	  function recurse(node)
	  {
	    if (node.incoming) node.incoming.forEach(recurse);
	    if (!node.handle) node.handle = ++i;
	    nodes.push(node);
	  }

	  recurse(root);
	  return nodes;
	}

}