/* FUNCTION TO FIND GROUPS FROM CELL RANGE BASED ON 3 OR MORE CHARACTERS */
function findStuff(eventData) {
  var app = UiApp.getActiveApplication();
  var searchStr = eventData.parameter.searchBox;
  if (searchStr.length < 3) { return app; }
  
  var content = ss.getRange(1,1,ss.getLastRow(),1).getValues();
  var cells = content.findCells(searchStr);
  if(searchStr == "") cells = [];
  
  var table = app.createFlexTable().setStyleAttribute("cursor", "pointer");    
  
  var image = app.getElementById('loadingImage').setVisible(false);
  var imageSearch = app.getElementById('loadingSearchImage').setVisible(false);
  var resultsPanel = app.getElementById('resultsPanel');  
  
  if (searchStr == userName) { searchStr = "Please click on My Groups"; }
  if (cells.length == 0) {     
    cells.push([searchStr]); searchStr = "MyGroups"; 
  }
  if (cells.length >= 0) { table.setStyleAttribute("border", "1px solid grey"); }
  app.getElementById('grid').setWidget(1,0, table);
  
  for (i = 0; i < cells.length; i++) {
    var clntHandler = app.createClientHandler().forEventSource().setEnabled(true).setStyleAttribute('backgroundColor', '#ffc').forTargets(resultsPanel).setVisible(false).forTargets(table).setVisible(false).forTargets(image).setVisible(true);
    var label = app.createLabel(cells[i][0])
    .setId(searchStr + "|" + cells[i][0])
    .addClickHandler(app.createServerClickHandler('showSelect'))
    .addClickHandler(clntHandler);    
    table.setWidget(i, 0, label);   
  }
  return app;
}


/* FUNCTION FOR CLICK HANDLER OF FLEX TABLE WHEN ROW IS CLICKED */
function showSelect(e){
  var app = UiApp.getActiveApplication()
  var result = e.parameter.source.trim().split('|');
  var child = result[1];
  var parent = result[0];
  var showBack = false;
  
  //clear existing content
  app.getElementById('resultsPanel').clear();
  app.getElementById('resultsPanel').setVisible(false);
  
  //add selected value to the search box
  app.getElementById('searchBox').setValue(child);
  
  //removes the flex table of results, there is no removeWidget call
  app.getElementById('dropDownSuggest').setWidget(1,0, app.createFlexTable());
  
  var image = app.getElementById('loadingImage').setVisible(false);
  var resultsPanel = app.getElementById('resultsPanel').setVisible(true);
  
  //create panel for results
  var panel = app.createVerticalPanel().setStyleAttribute('paddingLeft', '2px');
  var table = app.createFlexTable().setStyleAttribute('marginLeft', '10px').setStyleAttribute("cursor", "pointer");
  
  //cache the search and get parent
  var cache = CacheService.getPrivateCache();
  if (parent.indexOf("@warwickshire.gov.uk") != -1) {
    cache.put(child, parent);
  }
  var pgrp = cache.get(child);
  var gpgrp = cache.get(parent);
  var lblBack = app.createLabel();
  if (pgrp != '' && pgrp != null) {
    var backHandler = app.createClientHandler().forEventSource().setEnabled(true).forTargets(resultsPanel).setVisible(false).forTargets(image).setVisible(true);
    lblBack.setText("Back").setStyleAttribute("color", "blue").setStyleAttribute("textDecoration", "underline").setStyleAttribute("cursor", "pointer").setStyleAttribute('marginBottom', '5px')
    .setId(gpgrp + "|" + pgrp)
    .addClickHandler(backHandler)
    .addClickHandler(app.createServerClickHandler('showSelect'));
    showBack = true;
  }
    
  try {
    var group; var members; var memberName;
    
    //show the back button for valid parent references
    if (showBack) { panel.add(lblBack); }
    
    //switch between looking up user groups and the searched for group
    if (parent == "MyGroups") {
      members = GroupsManager.getAllGroups(child);
      panel.add(app.createLabel(child).setStyleAttribute('fontWeight', 'bold').setStyleAttribute('fontSize', '16px'));
    }
    else {
      group = GroupsManager.getGroup(child);
      panel.add(app.createLabel(group.getId()).setStyleAttribute('fontWeight', 'bold').setStyleAttribute('fontSize', '16px'));
      panel.add(app.createLabel(group.getDescription()).setStyleAttribute('marginBottom', '10px'));
      members = group.getAllMembers();
    }       
    panel.add(app.createLabel("Group Membership (" + members.length + ")").setStyleAttribute('fontSize', '14px'));    

    //loop through all members or groups depending on selection
    for (var i = 0; i < members.length; i++) {
      if (parent == "MyGroups") {
        memberName = members[i].getId();
      }
      else {
        memberName = members[i];
      }
      var clntHandler = app.createClientHandler().forEventSource().setEnabled(true).setStyleAttribute('backgroundColor', '#ffc').forTargets(resultsPanel).setVisible(false).forTargets(image).setVisible(true);
      var label = app.createLabel(memberName).setStyleAttribute("color", "blue").setStyleAttribute("textDecoration", "underline")
      .setId(child + "|" + memberName)
      .addClickHandler(clntHandler)
      .addClickHandler(app.createServerClickHandler('showSelect'));
      table.setWidget(i, 0, label);
    }
  }
  catch(e) {
    panel.add(lblBack);
    panel.add(app.createLabel("Sorry, could not read this group"));
  }
  
  panel.add(table);
  resultsPanel.add(panel);    
  app.getElementById('btnClear').setEnabled(true);
  return app;
}

//FUNCTION FOR FINDING VALUES IN CELLS
//extends Object .findCells(String) or .findCells(Number) reterns array[[number(row),number(column)]] 
Object.prototype.findCells = function(key) {   
  var searchMatch = [];
    for (j = 0; j < this.length; j++){
      if (this[j][0].toString().toLowerCase().search(key.toString().toLowerCase()) != -1){ 
        searchMatch.push([this[j][0],this[j][0]]);
      }
    }
  return searchMatch;
}