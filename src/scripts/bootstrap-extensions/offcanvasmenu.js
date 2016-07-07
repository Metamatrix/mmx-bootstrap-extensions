(function ($, doc) {

	var $doc = $(doc),
		$body = $("body"),
		opener,
		container,
		lastFocus,
		menu,
		overlay,
		openClass = "open";

	function showMenu() {

		opener = $(this);
		container = $("#off-canvas-container");
		lastFocus = doc.activeElement;
		menu = $(opener.data("target"));
		overlay = $(".off-canvas-backdrop");

		var menuIsHidden = !menu.attr("aria-hidden") || menu.attr("aria-hidden").toLowerCase() === "true",
			docHeight = $doc.height(),
			focusTarget = $(opener.data("focus-target")),
			iphone4 = navigator.userAgent.match(/iPhone/i) !== null && window.screen.height === (960 / 2);

		// Set the height of the menu and overlay if needed (some older versions of safari cannot deal with 100% height)
		// Set position to absolute older versions of safari cannot deal with fixed
		if (iphone4 && menu.height() < docHeight) {
			menu.height(docHeight).css("position", "absolute");
			overlay.height(docHeight);
		}

		opener.attr("aria-expanded", menuIsHidden);

		menu.attr("tabIndex", -1)
			.toggleClass("open", menuIsHidden)
			.attr("aria-hidden", !menuIsHidden);

		// focus the menu to make screen readers react to the opened menu
		// focus target specified by data attr or menu
		if (menuIsHidden && focusTarget.length === 0) {
			menu.focus();
		} else if (menuIsHidden && focusTarget.length) {
			focusTarget.focus();
		}

		// Show the backdrop
		container.addClass(openClass);

		$body.addClass("off-canvas-active");

		$doc.on("keyup", function (e) {
			if (e.keyCode === 27 && menu) {

				hideMenu();

				$doc.off("keyup");
			}
		});

		menu.find(".close").click(function () {
			hideMenu();
		});

		menu.on("keydown", function (e) {
			trapTabKey(e);
		});

		overlay.click(function () {
			hideMenu();
		});

	}

	function hideMenu() {

		if (!menu) { return; }

		menu.toggleClass("open", false)
			.attr("aria-hidden", true);

		opener.attr("aria-expanded", false);

		container.removeClass(openClass);

		$body.removeClass("off-canvas-active");

		if (lastFocus) {
			lastFocus.focus();
		}

		cleanup();
	}

	function cleanup() {
		lastFocus = null;
		menu = null;
		overlay = null;
		container = null;
		opener = null;
	}

	function trapTabKey(e) {

		// if tab is pressed
		if (e.keyCode === 9) {

			var focusableItemsSelector = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]",
				focusableItems = menu.find(focusableItemsSelector).filter(":visible"),
				focusedItem = $(":focus"),
				numberOfFocusableItems = focusableItems.length,
				focusedItemIndex = focusableItems.index(focusedItem);

			if (e.shiftKey) {
				//back tab
				// if focused on first item and user preses back-tab, go to the last focusable item
				if (focusedItemIndex === 0) {
					focusableItems.last().focus();
					e.preventDefault();
				}

			} else {
				//forward tab
				// if focused on the last item and user preses tab, go to the first focusable item
				if (focusedItemIndex === numberOfFocusableItems - 1) {
					focusableItems.first().focus();
					e.preventDefault();
				}
			}
		}

	}

	$.fn.offcanvasmenu = function () {

		return $(this).click(function (e) {
			e.preventDefault();

			showMenu.call(this);
		});

	};

	$.fn.offcanvasmenu.defaults = {};

	$(function () {
		$("[data-toggle='menu']").offcanvasmenu();
	});

})(jQuery, document);