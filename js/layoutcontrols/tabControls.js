
function TabController(numTabs) {
    let nTabs = numTabs;
    // let openTabs = [];
    
    //this will hold the html ref for the currently selected tab. To be used by other modules for context management.
    let selectedTabRef = {
        container : null,
        tabButton : null,
    }

    function addFile() {
        nTabs += 1;
    }

    function totalFiles () {
        return nTabs;
    }

    function selectThisTab (tabButtonRef, doClick = true) {
        if (doClick) {
            tabButtonRef.click();
            tabButtonRef.focus();
        }

        selectedTabRef.tabButton = tabButtonRef;
        selectedTabRef.container = getContainerForTab(tabButtonRef);
    }

    function getCurrentTabRef () {
        return selectedTabRef;
    }

    return {
        addFile,
        totalFiles,
        selectThisTab,
        getCurrentTabRef,
    };
}


const openTab = (element) => {


    //Hide all the tabs
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    //Uncolor all the tab selectors
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }

    const tabcontentToHighlight = getContainerForTab(element);
    tabcontentToHighlight.style.display = "block";
    
    tc.selectThisTab(element, doClick=false);
}

const addTab = (element) => {

    console.log(tc.totalFiles());

    tc.addFile();
    const fileNum = tc.totalFiles();

    tab_container = document.getElementById("contain_editors");
    tablink_container = document.getElementById("contain_tablinks");

    let div_tab = document.createElement("div");
    div_tab.id = `file${fileNum}`;
    div_tab.className = "tabcontent";
    div_tab.innerHTML = "Start typings .....";

    // let div_tab = `<div id="file${fileNum}" class="tabcontent">Start typings ..... </div>`
    let button_tab = document.createElement("button");
    button_tab.id = `tab-file${fileNum}`;
    button_tab.className = "button_effect tablink"
    button_tab.innerHTML = `File${fileNum}`
    button_tab.setAttribute("onclick","openTab(this)");

    tab_container.appendChild(div_tab);
    // document.getElementById(div_tab.id).className += " ";

    tablink_container.insertBefore(button_tab, element);
    // document.getElementById(button_tab.id).className += " button_effect tablink";

    //click the newly added button to select it.
    tc.selectThisTab(button_tab);
}


