
WCC Groups
----------
This application was developed as part of a corporate Google Apps migration from Lotus Notes at Warwickshire County Council. Some functionality was lost in the migration and so bespoke application were written to bridge the gap. The technology chosen was Google Apps Script as it offered a rich api to integrate with all Google resources.

For this application in particular, we needed access to the domain Google groups to search and display membership.

We chose to use [Google Apps Script][1] and build a custom UI using the [UI Service][2]. Here's how it looks.

[insert image of opening screen]

The included source files build the UI and allow search functionality across the list of Google groups. The Google groups are stored in a spreadsheet so they can easily searched. It was not possible to directly query the domain group api as it proved to slow.

**How to implement**

1. Create a Google spreadsheet
2. Add the script files included in the repository
3. Modify the global variables in code.gs and replace any spreadsheet_id entries
4. Run the scheduled function 'getAllGroups' to populate the spreadsheet with all the domain groups
5. Test the app by deploying

*Note:* You'll need to give the app permissions to read the Domain groups and have full access to the spreadsheet

A brief explanation of the code files and the functions

**Code.gs**

*doGet()*
main function that runs on load and builds the UI

*auditLog()*
log access to the application

**Scheduled.gs**

*getAllGroups()*
needs to be run on a schedule to populate the spreadsheet with domain groups

**Search**

*findStuff(eventData)*
Called from the keyUp handler on the search text box.
If 3 or more characters are entered a search is run and displayed in a dropdown list

*showSelect(e)*
Called from click handler on the search list
Use the form paramter search text box value to look up the google group and find it's members
The exiting group is stored in the private cache to allow user to navigate back up the groups hierachy
The group members are displayed in a list format as clickable links so drilldown is possible

**Template.gs**

*createHeader(app)*
Creates a header section for the UI app

*layoutPanels(app)*
A layout option for the UI app

*createSidebar(app, color)*
Alternative layout with sidebar

*createFooter(app)*
Creates a footer section for the UI app

Good luck!


  [1]: https://developers.google.com/apps-script/
  [2]: https://developers.google.com/apps-script/reference/ui/