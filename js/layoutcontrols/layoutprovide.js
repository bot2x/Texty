
//This will will used to manage instances of tab layouts being demanded.
function TabLayoutProvider () {
    let numTabLayouts = 0; //Hold the number of layouts provided.

    let providedLayouts = {};

    //get an instance of TabController.
    
    function createLayout(containerRef, nTabs=0) {
        if (!containerRef) { 
            alert("[Undefined Reference] Cannot create a tab layout without the container reference.");
            return;
        }
        const tabController = TabController(nTabs, numTabLayouts);

        const tabEditor = tabController.initTabLayout(containerRef);
        // console.log(tabEditor);
        
        console.log("tab controller ref : ", tabController);

        tabController.doHydrate(tabEditor, tabController);
        
        //Select the first tab as a default behavior.
        tabEditor.linkContainer.firstElementChild.click();
        
        tabLayoutAddedAt(containerRef, tabController);

        return tabController.getMyTabLayoutId();
    }

    function tabLayoutAddedAt (containerRef, tabControllerRef) {
        //Keep a ref around and increment.
        providedLayouts[numTabLayouts] = {
            "containerRef" : containerRef,
            "tabControllerRef" : tabControllerRef,
        }
        numTabLayouts++;
    }

    function getSelectedTabAtLayout (tablayoutid) {
        if (Number.isInteger(tablayoutid) && tablayoutid <= numTabLayouts) {
            return providedLayouts[tablayoutid].tabControllerRef.getCurrentTabRef();
        } else {
            alert("[Invalid tablayoutID]");
            return;
        }
    }

    return {
        createLayout,
        getSelectedTabAtLayout,
    }
}