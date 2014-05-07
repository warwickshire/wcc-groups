/* GLOBAL VARIABLES */
// service spreadsheet showing service status
var service_report = SpreadsheetApp.openById('spreadsheet_id').getSheetByName("Report");
// main spreadsheet holding the google groups list
var ss = SpreadsheetApp.openById('spreadsheet_id').getSheetByName("Groups");
// stats spreadsheet for holding user access stats
var sss = SpreadsheetApp.openById('spreadsheet_id').getSheetByName("Stats");
// image urls for loading throbbers
var loadingImg = 'loading_image_url';
var loadingSearchImg = 'loading_search_image_url';
// get the active user email
var userName = Session.getActiveUser().getEmail();

/* BUILD UI */
function doGet(){
  
  //log usage
  auditLog();
  
  //create app container
  var app = UiApp.createApplication().setTitle('WCC Groups'); ;
  app.setStyleAttribute('width', '100%').setStyleAttribute('height', '100%').setStyleAttribute('overflow', 'auto');
   
  //create main panels and controls
  var panel = app.createAbsolutePanel().setId('panel').setStyleAttribute('minHeight', '100%').setStyleAttribute('position', 'relative');  
  var content = app.createAbsolutePanel().setId('content').setStyleAttribute('paddingLeft', '30px').setStyleAttribute('paddingBottom', '35px'); 
  var image = app.createImage(loadingImg).setVisible(false).setId('loadingImage');
  var imageSearch = app.createImage(loadingSearchImg).setVisible(false).setId('loadingSearchImage');
  var resultsPanel = app.createVerticalPanel().setId('resultsPanel')
  
  //header text
  content.add(app.createHTML('<div style="font-size:26px;margin-top:10px;padding-left:2px;">WCC Groups</div>'));  
  content.add(app.createHTML('<div style="font-size:13px;padding-left:2px;">Enter three or more characters to search all WCC groups</div>'));
  
  //grid for results of search
  var grid = app.createGrid(2,1).setId('grid').setBorderWidth(0).setCellPadding(0).setCellSpacing(0);
  content.add(grid);

  //container for search box and controls 
  var dropDownSuggest = app.createFlexTable().setId('dropDownSuggest').setStyleAttribute("cursor", "pointer").setBorderWidth(0).setCellPadding(0).setCellSpacing(0);
  app.getElementById('grid').setWidget(0,0, dropDownSuggest);

  //create search box with handlers
  var focusHandler = app.createClientHandler().forEventSource().setText('');
  var searchBox = app.createTextBox().setName('searchBox').setId('searchBox').setStyleAttribute('width', '400px').addFocusHandler(focusHandler);
  dropDownSuggest.setWidget(0, 0, searchBox);
  dropDownSuggest.setWidget(0, 1, imageSearch);

  //clear button
  var handler = app.createClientHandler().forEventSource().setEnabled(false).forTargets(searchBox).setText("").forTargets(resultsPanel).setVisible(false);
  var btnClear = app.createButton().setText("Clear Search").addClickHandler(handler).setId('btnClear');
  dropDownSuggest.setWidget(0, 2, btnClear);
  
  //'My Groups' button
  var hdlrMyGroups = app.createServerClickHandler('showSelect');
  var clntMyGroups = app.createClientHandler().forEventSource().setEnabled(true).forTargets(resultsPanel).setVisible(false).forTargets(image).setVisible(true).forTargets(searchBox).setText("");
  var btnMyGroups = app.createButton().setText("My Groups").addClickHandler(clntMyGroups).addClickHandler(hdlrMyGroups).setId('MyGroups|' + userName);
  dropDownSuggest.setWidget(0, 3, btnMyGroups);

  // search results
  var resultsTable = app.createFlexTable();
  dropDownSuggest.setWidget(1,0, resultsTable);
  
  //create list control with handlers
  var listClientHandler = app.createClientHandler().forTargets(imageSearch).setVisible(true).forTargets(resultsPanel).setVisible(false);
  var listHandler = app.createServerKeyHandler('findStuff').addCallbackElement(grid);
  searchBox.addKeyUpHandler(listHandler).addKeyDownHandler(listClientHandler); 

  //add all controls to top level app
  content.add(resultsPanel);
  content.add(image);  
  panel.add(createHeader(app)); 
  panel.add(content);
  panel.add(createFooter(app));
  app.add(panel);
  
  return app;
}


//track usage of the app, stored centrally in stats spreadsheet
function auditLog() { 
  var values = [[ "WCC Groups Widget", userName, new Date() ]];
  var l = sss.getLastRow();
  var range = sss.getRange(l+1,1,1,3).setValues(values);
}
