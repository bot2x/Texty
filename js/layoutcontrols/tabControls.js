numOfTabLayouts = 0 //this is global variable. Wrap this in a function later.
 

//This is going to be the main function class which will coordinate all tab related operations.
function TabController(numTabs=0) {
    let nTabs = numTabs;
    // let openTabs = [];
    const selfRef = this;

    function getThis() {
        return selfRef;
    }

    function initTabLayout (tabContainerRef) {
        if (!tabContainerRef) alert("[Undefined Reference] Cannot create a tab layout without the container reference.");

        const tabEditor = getTabParentContainers();
        let tabs = null;

        for (let tn=1; tn<=nTabs; tn++){
            tabs = getTabDivPair(tn);

            tabEditor.editorContainer.appendChild(tabs.tabcontent);
            tabEditor.linkContainer.appendChild(tabs.tablink);
        }

        console.log(tabEditor);

        //add the add more button
        tabEditor.linkContainer.appendChild(getAddTabButton());

        //Insert the tab layout in the DOM.
        tabContainerRef.appendChild(tabEditor.navBar);
        tabContainerRef.appendChild(tabEditor.editorContainer);
        tabContainerRef.appendChild(tabEditor.linkContainer);

        //Hydrate the added components in the DOM.
        doHydrate(tabEditor);
        
        //Select the first tab as a default behavior.
        tabEditor.linkContainer.firstElementChild.click();
        
        //incr the global counter.
        numOfTabLayouts++;
    }

    function doHydrate(tabEditorRef=null) {
        console.log ("do hydration is called.");
        handleTabEvents = tabEventHandlers();

        // console.log(handleTabEvents.openTabHandler);
        // if (tabContainerRef) {
        //     //Let walk the container elements to hydrate them.
        //     for (const child of tabContainerRef.children) {
        //         if (child.id.startsWith("contain_tablinks")) {
        //             for (const cn of child.children) {
        //                 if (cn.id.startsWith("tab-file")){
        //                     cn.addEventListener('click', () => handleTabEvents.openTabHandler(cn));
        //                 }
        //                 if (cn.id.startsWith("add_tab")) {
        //                     cn.addEventListener('click', () => handleTabEvents.addTabHandler(cn));
        //                 }
        //             }
        //         }
        //     }
        // } 
        if (tabEditorRef) {
            for (const cn of tabEditorRef.linkContainer.children) {
                if (cn.id.startsWith("tab-file")){
                    cn.addEventListener('click', () => handleTabEvents.openTabHandler(cn, getThis()));
                }
                if (cn.id.startsWith("add_tab")) {
                    cn.addEventListener('click', () => handleTabEvents.addTabHandler(cn, getThis()));
                }
            }

        } else {
            //To apply for manually created ones.

            //attach event listeners.
            tabButtons = document.getElementsByClassName("tablink");
            addTabButton = document.getElementById("add_tab");

            Array.from(tabButtons).forEach((t) => {
                
            console.log(t.className);

                t.addEventListener('click', () => handleTabEvents.openTabHandler(t));
            });

            addTabButton.addEventListener('click', () => handleTabEvents.addTabHandler(addTabButton));
        }
        console.log("hydration is finished.");
    }
    //Setup the tab layout and hydrate it.
    // doHydrate(); //Moving this as a step for initTabLayout.

    //this will hold the html ref for the currently selected tab. To be used by other modules for context management.
    let selectedTabRef = {
        container : null,
        tabButton : null,
    }

    function incrTabs () {
        nTabs += 1;
    }

    function totalOpenTabs () {
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
        incrTabs,
        totalOpenTabs,
        selectThisTab,
        getCurrentTabRef,
        initTabLayout,
        // getThis,
    };
}

//This will hold all tab related event handlers.
function tabEventHandlers () {
    console.log("tab event handler instantiated.");

    const openTabHandler = (element, tcRef = null) => {

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
        
        if (tcRef)
            tcRef.selectThisTab(element, doClick=false); 
        else
            tc.selectThisTab(element, doClick=false);
    }

    const addTabHandler = (element, tcRef = null) => {

        let fileNum = 0;
        if (tcRef) {
            console.log(tcRef.totalOpenTabs());
            
            tcRef.incrTabs();
            fileNum = tcRef.totalOpenTabs();

            tablink_container = element.parentNode; //document.getElementById("contain_tablinks");
            tab_container = tablink_container.previousSibling;

        } else {
            console.log(tc.totalOpenTabs());

            tc.incrTabs();
            fileNum = tc.totalOpenTabs();

            tab_container = document.getElementById("contain_editors");
            tablink_container = document.getElementById("contain_tablinks");
        }

        let div_tab = document.createElement("div");
        div_tab.id = `file${fileNum}`;
        div_tab.className = "tabcontent";
        div_tab.contentEditable="true";
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
        if (tcRef) 
            tcRef.selectThisTab(button_tab);
        else
            tc.selectThisTab(button_tab);
    }

    return {
        openTabHandler,
        addTabHandler,
    }
}
