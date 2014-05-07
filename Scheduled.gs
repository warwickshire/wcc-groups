/* SCHEDULED FUNCTIONS */

//get all the groups and writes them to the excel spreadsheet
function getAllGroups() {
  var range = ss.getRange(1, 1, ss.getLastRow(), 1).clear(); 
  var groups = GroupsManager.getAllGroups();
  var j = groups.length;
  var grpArray = new Array(j);
  for (var i in groups) {
    grpArray[i] = new Array(1);
    try {
      grpArray[i][0] = groups[i].getId();
    }
    catch(e) {
      Logger.log(Utilities.jsonStringify(groups[i]));
    }
  }
  ss.getRange(1, 1, j, 1).setValues(grpArray);
  
  // update the service report spreadsheet
  service_report.getRange("B4").setValue(new Date());
}