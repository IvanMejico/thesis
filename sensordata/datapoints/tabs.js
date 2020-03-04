// CHECK SELECTED TABS
envi_tabs = document.getElementsByName("filter-environment");
acload_tabs = document.getElementsByName("filter-ac-electric");
wind_tabs = document.getElementsByName("filter-wind-electric");
solar_tabs = document.getElementsByName("filter-solar-electric");

function assignChangeEventToTabs(tabs) {
    var prev = null;
    for(var i=0; i<tabs.length; i++) {
        tabs[i].addEventListener('change', function() {
            if(this !== prev) {
                prev = this;
            }
            // render chart
            console.log(this);
        })
    }
}

assignChangeEventToTabs(envi_tabs);
assignChangeEventToTabs(acload_tabs);
assignChangeEventToTabs(wind_tabs);
assignChangeEventToTabs(solar_tabs);