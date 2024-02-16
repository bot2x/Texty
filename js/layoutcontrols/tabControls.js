// numOfTabLayouts = 0 //this is global variable. Wrap this in a function later.
 

//This is going to be the main function class which will coordinate all tab related operations.
function TabController(numTabs=0, tablayoutId=0) {
    let myTabLayoutId = tablayoutId;
    let nTabs = numTabs;
    
    //this will hold the html ref for the currently selected tab. To be used by other modules for context management.
    let selectedTabRef = {
        container : null,
        tabButton : null,
    }

    function initTabLayout (tabContainerRef) {
        if (!tabContainerRef) alert("[Undefined Reference] Cannot create a tab layout without the container reference.");

        const tabEditor = getTabParentContainers(myTabLayoutId);
        let tabs = null;

        for (let tn=1; tn<=nTabs; tn++){
            tabs = getTabDivPair(tn, myTabLayoutId);

            tabEditor.editorContainer.appendChild(tabs.tabcontent);
            tabEditor.linkContainer.appendChild(tabs.tablink);
        }

        console.log(tabEditor);

        //add the add more button
        tabEditor.linkContainer.appendChild(getAddTabButton(myTabLayoutId));

        //Insert the tab layout in the DOM.
        tabContainerRef.appendChild(tabEditor.navBar);
        tabContainerRef.appendChild(tabEditor.editorContainer);
        tabContainerRef.appendChild(tabEditor.linkContainer);

        // //incr the global counter.
        // numOfTabLayouts++;
        return tabEditor;
    }

    function doHydrate(tabEditorRef, tabControllerRef=null) {
        console.log ("do hydration is called.");
        if (!tabEditorRef) {
            alert("[Undefined Reference] Cannot hydrate without tabEditor ref.");
            return;
        }

        handleTabEvents = tabEventHandlers();

        console.log(tabEditorRef);
        console.log(tabControllerRef);

        if (tabEditorRef) {
            for (const cn of tabEditorRef.linkContainer.children) {
                if (cn.id.startsWith(`layout${myTabLayoutId}.tab-file`)){
                    cn.addEventListener('click', () => handleTabEvents.openTabHandler(cn, tabControllerRef));
                }
                if (cn.id === `layout${myTabLayoutId}.add_tab`) {
                    cn.addEventListener('click', () => handleTabEvents.addTabHandler(cn, tabControllerRef));
                }
            }

        }
        console.log("hydration is finished.");
    }
    //Setup the tab layout and hydrate it.
    // doHydrate(); //Moving this as a step for initTabLayout.

    function getMyTabLayoutId () {
        return myTabLayoutId;
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
        console.log("before : ", selectedTabRef);
        selectedTabRef.tabButton = tabButtonRef;
        selectedTabRef.container = getContainerForTab(tabButtonRef);
        console.log("after : ", selectedTabRef);
    }

    function getCurrentTabRef () {
        return selectedTabRef;
    }

    return {
        myTabLayoutId,
        selectedTabRef,
        incrTabs,
        totalOpenTabs,
        selectThisTab,
        getCurrentTabRef,
        initTabLayout,
        doHydrate,
        getMyTabLayoutId,
    };
}

//This will hold all tab related event handlers.
function tabEventHandlers () {
    console.log("tab event handler instantiated.");

    const openTabHandler = (element, tcRef = null) => {
        if (!tcRef) {
            alert("[Undefined Reference] TabController instance missing.");
            return;
        }

        console.log("open tab got called.");
        console.log("element ref i got is : ", element);

        let layout_class_name = `belongs_to_layout_${tcRef.getMyTabLayoutId()}`;

        //Hide all the tabs
        tabcontent = document.getElementsByClassName(`tabcontent ${layout_class_name}`);

        console.log("filtered tab contents : ", tabcontent);

        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        //Uncolor all the tab selectors
        tablinks = document.getElementsByClassName(`tablink ${layout_class_name}`);
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].style.backgroundColor = "";
            tablinks[i].classList.remove("selected_tab_button");
        }

        const tabcontentToHighlight = getContainerForTab(element);
        console.log(tabcontentToHighlight);

        tabcontentToHighlight.style.display = "block";
        element.classList.add("selected_tab_button");
        
        tcRef.selectThisTab(element, doClick=false);   
    }

    const addTabHandler = (element, tcRef) => {
        if (!tcRef) {
            alert("[Undefined Reference] TabController instance missing.");
            return;
        }

        let fileNum = 0;
        console.log(tcRef.totalOpenTabs());
        
        tcRef.incrTabs();
        fileNum = tcRef.totalOpenTabs();

        tablink_container = element.parentNode;
        tab_container = tablink_container.previousSibling;


        const tabInfo = getTabDivPair(fileNum, tcRef.getMyTabLayoutId());

        const div_tab = tabInfo.tabcontent;
        const button_tab = tabInfo.tablink;

        button_tab.addEventListener('click', () => openTabHandler(button_tab, tcRef));

        tab_container.appendChild(div_tab);
        tablink_container.insertBefore(button_tab, element);

        //click the newly added button to select it.
        tcRef.selectThisTab(button_tab);
    }

    return {
        openTabHandler,
        addTabHandler,
    }
}