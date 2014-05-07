//create header section
function createHeader(app) {
  var imgWhiteLogo = 'corporate_image_url';
  var panelHeader = app.createAbsolutePanel();
  panelHeader.setHeight(80).setWidth('100%').setStyleAttribute('background-color', 'rgb(0,109,60)').setStyleAttribute('text-align', 'left');
  var imgHeader = app.createImage(imgWhiteLogo).setStyleAttribute('margin-top', '5px').setStyleAttribute('padding-left', '20px');
  panelHeader.add(imgHeader); 
  return panelHeader;
}

//create a two panel layout with float right and left
function layoutPanels(app) {
  var panelLayout = app.createAbsolutePanel();
  var leftPanel = app.createHorizontalPanel().setWidth(450).setBorderWidth(0).setStyleAttribute('float', 'left').setId('panelLeft');
  var rightPanel = app.createHorizontalPanel().setWidth(450).setBorderWidth(0).setStyleAttribute('float', 'right').setId('panelRight');
  panelLayout.add(leftPanel).add(rightPanel);
  return panelLayout;
}

//create sidebar to indicate busy/free
function createSidebar(app, color) {
  var indicatorPanel = app.createVerticalPanel().setHeight('100%').setWidth('75px').setStyleAttribute('position', 'absolute').setStyleAttribute('left', '0px').setStyleAttribute('top', '100px');
  indicatorPanel.setStyleAttribute('background', '-webkit-linear-gradient(left,  rgb(16,149,45) 0%,rgb(0,109,60) 100%)');
  indicatorPanel.add(app.createLabel(''));
  return indicatorPanel;
}

//create footer section
function createFooter(app) {
  var panelFooter = app.createAbsolutePanel();
  panelFooter.setHeight(30).setWidth('100%').setStyleAttribute('color', 'white').setStyleAttribute('text-align', 'center');
  panelFooter.setStyleAttribute('background-color', 'rgb(0,109,60)').setStyleAttribute('position', 'absolute').setStyleAttribute('bottom', '0px').setStyleAttribute('height', '30px');
  panelFooter.add(app.createHTML('© Warwickshire County Council').setStyleAttribute('margin-top', '5px'));
  return panelFooter
}