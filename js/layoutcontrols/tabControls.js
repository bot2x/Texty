// numOfTabLayouts = 0 //this is global variable. Wrap this in a function later.
 

//This is going to be the main function class which will coordinate all tab related operations.
function TabController(numTabs=0, tablayoutId=0) {
    let myTabLayoutId = tablayoutId;
    let nTabs = numTabs;
    const activeTabIds = new Set();

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

            addTabId(tn);
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
                    cn.addEventListener('click', () => handleTabEvents.openTabHandler(cn, tabControllerRef)); //Attach select this tab handler.
                    cn.lastChild.addEventListener('click', (evt) => handleTabEvents.closeTabHandler(evt, cn.lastChild, tabControllerRef)); //attach close tab handler.
                }
                if (cn.id === `layout${myTabLayoutId}.add_tab`) {
                    cn.addEventListener('click', () => handleTabEvents.addTabHandler(cn, tabControllerRef));
                }
            }

            var text_box = tabEditorRef.editorContainer.getElementsByClassName('editor');
            var line_numbers = tabEditorRef.editorContainer.getElementsByClassName('line-numbers');
            
            // Add handler for line numbers and Tab input.
            Array.from(text_box).forEach((textBox, index) => {
                handleTabEvents.lineNumberAndTabHandler(textBox, line_numbers[index]);
            });


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
    function decrTabs () {
        nTabs -= 1;
    }

    function totalOpenTabs () {
        return nTabs;
    }

    function getNewTabId () {
        let tabid = 0;
        while (activeTabIds.has(++tabid));
        // activeTabIds.add(numTabs); //dont add here. add after the creation is successful.
        return tabid;

    }

    function addTabId (tabId) {
        //todo : sanity checks to be added and fallbacks to be implemented.
        activeTabIds.add(tabId);
    }

    function remmoveTabId (tabId) {
        activeTabIds.delete(tabId);
    }

    function selectThisTab (tabButtonRef, doClick = true) {
        if (doClick) {
            tabButtonRef.click();
            tabButtonRef.focus();
        }
        selectedTabRef.tabButton = tabButtonRef;
        selectedTabRef.container = getContainerForTab(tabButtonRef);
    }

    function closeThisTab(closeTabRef) {
        const buttonTabRef = closeTabRef.parentNode;
        let prevTabButtonRef = null;

        if (buttonTabRef === selectedTabRef.tabButton) {
            //We are trying to close the tab which is selected. We need to move the focus to the previous tab.
            prevTabButtonRef = buttonTabRef.previousSibling;
        }
        const editorTabRef= getContainerForTab(buttonTabRef);

        //We have the refs to both button and the editor. Remove them and click the prevTabButton is it exists.
        editorTabRef.remove();
        buttonTabRef.remove();
        
        //hacking this now. Implement a proper tabid structure to stop having to write messy code.
        let tabid = closeTabRef.id.split('.')[1].split('file')[1];
        console.log(tabid);
        remmoveTabId(parseInt(tabid));
        decrTabs();

        if (prevTabButtonRef) {
            selectThisTab(prevTabButtonRef);
        }
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
        closeThisTab,
        getNewTabId,
        addTabId,
        remmoveTabId,
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

        tabcontentToHighlight.style.display = "inline-flex";
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
        
        // tcRef.incrTabs();
        fileNum = tcRef.getNewTabId();

        tablink_container = element.parentNode;
        tab_container = tablink_container.previousSibling;


        const tabInfo = getTabDivPair(fileNum, tcRef.getMyTabLayoutId());

        const div_tab = tabInfo.tabcontent;
        const button_tab = tabInfo.tablink;
        const close_tab = tabInfo.closetab;

        button_tab.addEventListener('click', () => openTabHandler(button_tab, tcRef));
        close_tab.addEventListener('click', (evt) => closeTabHandler(evt, close_tab, tcRef));

        tab_container.appendChild(div_tab);
        tablink_container.insertBefore(button_tab, element);
        tcRef.addTabId(fileNum);

        //click the newly added button to select it.
        tcRef.selectThisTab(button_tab);
    }

    function closeTabHandler(evt, element, tcRef) {
        if (!tcRef) {
            alert("[Undefined Reference] TabController instance missing.");
            return;
        }
        evt.stopPropagation();

        tcRef.closeThisTab(element);

    }


    const lineNumberAndTabHandler = (text_element,line_number_element) => {
        var num_of_lines = 1;
        text_element.style.minHeight = parseFloat(getComputedStyle(text_element).lineHeight) + 'px';
        text_element.addEventListener('input', function(event) {
            var lineHeight = parseFloat(getComputedStyle(text_element).lineHeight);
            var currentHeight = text_element.scrollHeight;
            var lines = parseInt(currentHeight / lineHeight);
            
            // Update line number only if there is a change in number of line numbers
            if (lines !== num_of_lines) {
                num_of_lines = lines;
                line_number_element.innerHTML = '';
                for (var j = 1; j < lines + 1; j++) {
                    var span = document.createElement('span');
                    span.textContent = j;
                    line_number_element.appendChild(span);
                }
            }

        });

        // Handle Tab key press in the text editor
        text_element.addEventListener('keydown', function(e) {
            if (e.keyCode === 9) {
                e.preventDefault();
                // Insert a tab character
                const selection = window.getSelection();
                const tabNode = document.createTextNode('\t');
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(tabNode);
                range.setStartAfter(tabNode);
                range.setEndAfter(tabNode);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });
        text_element.style.whiteSpace = 'pre-wrap';

        
    }



    return {
        openTabHandler,
        addTabHandler,
        closeTabHandler,
        lineNumberAndTabHandler
    }
}
