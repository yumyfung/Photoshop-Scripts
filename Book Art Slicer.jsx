﻿// BookArtSlicer.jsx// Bruno Herfst 2010//// A photoshop javascript for slicing images for fore-edge-bleed.// You need an image with the same dimensions as the spine. (Don’t forget to only bleed top and bottom!)// After running this script run export Layers to files.// tested in Photoshop CS5#target Photoshop;app.bringToFront();buildDialog();// Create the dialog windowfunction buildDialog(){	//first check if there is a document open	if (app.documents.length == 0) {		alert("No art no work.");	} else {		// The dialog window		var dlg = new Window("dialog", "Book-Art Slicer"),			uD = undefined;		//all we need to know is the extent		dlg.extendLabel = dlg.add("statictext", uD, "Extent");		dlg.extendInput = dlg.add("edittext", [15,35,100,55]);				dlg.cancelBut = dlg.add("button", uD, "Cancel");		dlg.buildBut = dlg.add("button", uD, "OK");		// The button functionality		dlg.cancelBut.onClick = function () { 			dlg.close();		}		dlg.buildBut.onClick = function () {			var myExtent = Number(dlg.extendInput.text);			if(isNaN(myExtent)){				alert("NaN :(");			}else if(myExtent % 2 === 0){				slice(myExtent);				dlg.close();			} else {				alert("A books extend should be even");			}		}		// Go and get the variables!		dlg.show();	}}function slice(myExtent){	//devide extent by 2	//as we place every image on both side of the page	//this will give a clean and sharp edge	var myAmount = myExtent/2,		myDocName = app.activeDocument.name,  // save the activeDocument name before duplicate.		myOriginal = app.documents[myDocName],		myDoc = app.activeDocument.duplicate(), // duplicate doc before flatten		// Save the current preferences		startRulerUnits = app.preferences.rulerUnits,		startDisplayDialogs = app.displayDialogs;	// flatten file so we copy all vissible px	myDoc.flatten();	// Set Adobe Photoshop CS5 to use pixels and display no dialogs	app.preferences.rulerUnits = Units.PIXELS;	//app.displayDialogs = DialogModes.NO;		// prepare the file by adjusting the amount of pixels in width	myDoc.resizeImage(		UnitValue(myAmount,"px"),//width		myDoc.height,//height		null, //res		ResampleMethod.BICUBICSHARPER);		var myHeight = myDoc.height.value,		myWidth = myDoc.width.value,		myRes = myDoc.resolution.value,		bgLayer = myDoc.layers[myDoc.layers.length - 1];	//for every pixelrow create a new image	for(var x = 0; x < myAmount; x++){		//select a row of pixels		myDoc.selection.select([			// Top Left X,Y			[x,0],			// Top Right X,Y			[x+1,0],			// Bottom Right X,Y			[x+1,myHeight],			// Bottom Left X,Y			[x,myHeight]		]);		//create the layers for layer visibility in InDesign		myDoc.activeLayer = myDoc.layers[myDoc.layers.length - 1]; //Copy from BG		myDoc.selection.copy();		myDoc.paste();		//active layer is now pasted layer		//move layer to left top corner so resize keeps on canvas		align( myDoc,'AdLf');		align( myDoc,'AdTp');		myDoc.activeLayer.resize(myWidth*100,100,AnchorPosition.TOPLEFT);		//transform to fit canvas			}	// Reset the application preferences	app.preferences.rulerUnits = startRulerUnits;	alert("Done!")	//app.displayDialogs = startDisplayDialogs;}function align(myDoc,method) { myDoc.selection.selectAll();   // methods:    // 'AdCH' - center horizontal    // 'AdCV' - center vertical    // 'AdLf' - left    // 'AdBt '- bottom    // 'AdTp' - Top   //  'AdRg' - Right   var desc = new ActionDescriptor();           var ref = new ActionReference();           ref.putEnumerated( charIDToTypeID( "Lyr " ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );        desc.putReference( charIDToTypeID( "null" ), ref );        desc.putEnumerated( charIDToTypeID( "Usng" ), charIDToTypeID( "ADSt" ), charIDToTypeID( method ) );    try{   executeAction( charIDToTypeID( "Algn" ), desc, DialogModes.NO );    }catch(e){}   myDoc.selection.deselect();}; 