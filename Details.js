frappe.ui.form.on('Patient Encounter', {
    setup: function (frm) {
        console.log("Form setup called. Adding custom button styling to the Details tab.");

        frappe.after_ajax(function () {
            // Find the "Details" tab link and change it to match the Encounter Details button style
            let detailsTabLink = $("a:contains('Details')");

            if (detailsTabLink.length) {
                console.log("Details tab link found. Modifying to match Encounter Details button style...");

                // Add the button in the same place as the Details tab link
                detailsTabLink.parent().replaceWith(`
                    <button class="btn btn-secondary btn-xs" id="details-tab-btn" style="margin: 5px;">
                        Details
                    </button>
                `);

                // Attach an event to navigate to the Details section
                $("#details-tab-btn").on("click", function () {
                    console.log("Details button clicked.");
                    // Navigate to the "Details" section using native Frappe function
                    frm.scroll_to_field('details');
                });
            } else {
                console.warn("Details tab link NOT found during setup.");
            }
        });
    }
});