SwipePrompt = function() {
	
    var self = this;

    this.enabled = false;
    this.holder = document.getElementById("holder");
    this.el = document.getElementById("sp");

    this.spec = this.getSpec();

    if (!this.spec) {
        
        this.el.style.visibility = "hidden";
        return;
    }
        
    this.height = this.spec[0];

    window.addEventListener("resize", function(event) {

        self.onResize();
    });
    
    this.el.addEventListener("touchend", function(event) {
        
        if (self.enabled) {
            
            self.showGame();
            event.preventDefault();
            event.returnValue = false;
        }
    });

    this.onResize();
}
	
SwipePrompt.prototype = {
        
    onResize : function() {

        if (window.innerHeight > window.innerWidth || window.innerHeight === this.height) {
			
            this.showGame();
            window.scrollTo(0, 0);
        }
        else {
            
            this.showSwipePrompt();
            window.scrollTo(0, 0);
        }
    },

    getSpec : function() {
		
        var devices = [
			
			[320, 480, 2, "4"],
            [320, 568, 2, "5/SE"],
            [375, 667, 2, "6/7/8"],
            [414, 736, 3, "6/7/8 plus"],
            [375, 812, 3, "X/XS"],
            [414, 896, 3, "XS Max"],
            [414, 896, 2, "XR"]

        ];

        for (var t = 0; t < devices.length; t++) {
        
			var device = devices[t];
            var isDevice = window.screen.height == device[0] && window.screen.width == device[1] || window.screen.width == device[0] && window.screen.height == device[1];
            
			if (isDevice) {
				
				return device;
            }
        }
		
		return null;
    },

    showSwipePrompt : function() {
        
        this.enabled = true;
        this.holder.className = this.holder.className.replace("sp_disabled", "sp_enabled");
        this.el.style.visibility = "visible";
        this.el.style.height = "999999px";
        this.el.style.zIndex = 999999;
        this.el.style.pointerEvents = "all";
    },

    showGame : function() {
       
		this.el.removeEventListener("touchend", this.showGame);
        this.enabled = false;
        this.holder.className = this.holder.className.replace("sp_enabled", "sp_disabled");
        this.el.style.visibility = "hidden";
        this.el.style.height = this.height + 1 + "px";
        this.el.style.pointerEvents = "none";
    }
}