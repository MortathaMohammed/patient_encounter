frappe.ui.form.on('Patient Encounter', {
    setup: function(frm) {
        console.log("Form setup called. Adding custom button styling to the Details tab.");

        frappe.after_ajax(function() {
            let detailsTabLink = $("a:contains('Notes')");

            if (detailsTabLink.length) {
                console.log("Details tab link found. Modifying to match Encounter Details button style...");

                detailsTabLink.addClass('btn btn-secondary btn-xs').css({
                    'margin': '5px',
                    'padding': '5px 10px',
                    'background-color': detailsTabLink.css('background-color'),  
                    'color': 'white',  
                    'border': detailsTabLink.css('border'), 
                    'border-radius': detailsTabLink.css('border-radius')
                });
            } else {
                console.warn("Details tab link NOT found during setup.");
            }
        });
    }
});