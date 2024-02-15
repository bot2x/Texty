//This is going to be the main function class which will coordinate all tab related operations.
function TabController(numTabs) {
    let nTabs = numTabs;
    // let openTabs = [];

    function doSetup() {
        console.log ("do setup is called.");
        handleTabEvents = tabEventHandlers();

        // console.log(handleTabEvents.openTabHandler);

        //attach event listeners.
        tabButtons = document.getElementsByClassName("tablink");
        addTabButton = document.getElementById("add_tab");

        Array.from(tabButtons).forEach((t) => {
            
        console.log(t.className);

            t.addEventListener('click', () => handleTabEvents.openTabHandler(t));
        });

        addTabButton.addEventListener('click', () => handleTabEvents.addTabHandler(addTabButton));

        console.log("hydration is finished.");
    }
    //Setup the tab layout and hydrate it.
    doSetup();

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

//This will hold all tab related event handlers.
function tabEventHandlers () {
    console.log("tab event handler instantiated.");

    const openTabHandler = (element) => {

        console.log("open tab got called.");
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

    const addTabHandler = (element) => {

        console.log(tc.totalFiles());

        tc.addFile();
        const fileNum = tc.totalFiles();

        tab_container = document.getElementById("contain_editors");
        tablink_container = document.getElementById("contain_tablinks");

        let div_tab = document.createElement("div");
        div_tab.id = `file${fileNum}`;
        div_tab.className = "tabcontent";
        div_tab.innerHTML = `Start typings in file - ${fileNum}`;

        // let div_tab = `<div id="file${fileNum}" class="tabcontent">Start typings ..... </div>`
        let button_tab = document.createElement("button");
        button_tab.id = `tab-file${fileNum}`;
        button_tab.className = "button_effect tablink";
        button_tab.innerHTML = `File${fileNum}`;
        button_tab.addEventListener('click', () => openTabHandler(button_tab));

        // button_tab.setAttribute("onclick","openTab(this)");

        tab_container.appendChild(div_tab);
        // document.getElementById(div_tab.id).className += " ";

        tablink_container.insertBefore(button_tab, element);
        // document.getElementById(button_tab.id).className += " button_effect tablink";

        //click the newly added button to select it.
        tc.selectThisTab(button_tab);
    }

    return {
        openTabHandler,
        addTabHandler,
    }
}
