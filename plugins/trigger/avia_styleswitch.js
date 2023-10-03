
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};


jQuery.noConflict();

jQuery(document).ready(function(){


	//links that I wont be able to filter are modified via js. for example the event links script
	var the_b		= jQuery('body'),
		all_links = 'a[href*="?skin"]';
		
	the_b.on('mouseenter mousedown',all_links, function()
	{
		avia_events_modify_attribute(this, 'href');
	});
	
	var all_forms = 'form[action*="?skin"]';
	the_b.on('mouseenter',all_forms, function()
	{
		avia_events_modify_attribute(this, 'action');
	});	
	
	
	


	function avia_events_modify_attribute(the_link, attr_to_change)
	{
		var the_href  = the_link[attr_to_change],
			new_link = avia_events_modify_url(the_href);
		
		if(new_link)
		{
			the_link[attr_to_change] = new_link;
		}
	}
	
	function avia_events_modify_url(the_href)
	{
		var the_check = false, add_sufx  = "";
	
		if(the_check = the_href.match(/\?skin=(.+?)\//))
		{
			add_sufx = the_check[0].replace( /([A-Z])/g, " $1" );
			add_sufx = add_sufx.replace( /=\s/g, "=" );
			add_sufx = add_sufx.replace( /\s\s/g, " " );
			add_sufx = encodeURI(add_sufx.replace( /\//g, "" ));
			
			return the_href.replace(/\?skin=(.+?)\//, "/") + add_sufx;
		}
		
		return false;
	}
	
	
	
	// datepicker
	if(typeof jQuery.pjax == "function")
	{
		jQuery(".tribe-events-events-dropdown").die('change').live('change', function() {
			baseUrl = jQuery(this).parent().attr("action");
			
			url = avia_events_modify_url(decodeURI( baseUrl )+ "/" + jQuery('#tribe-events-events-year').val() + '-' + jQuery('#tribe-events-events-month').val());
	
	      jQuery('.ajax-loading').show(); 
			jQuery.pjax({ url: url, container: '#tribe-events-content', fragment: '#tribe-events-content', timeout: 1000 });
		});
	}






	var link_controller_links = jQuery('.link_controller_list a').not('.no_ajax a');
	
	link_controller_links.click(function()
	{
		var link 	= this,
			dynamic = jQuery('#dynamic-styles'),
			loader  = jQuery('.avia_styleswitcher .avia_loader');
		
		if(dynamic.length && !link.href.match(/bg_image_repeat=fullscreen/))
		{
			jQuery.ajax({
			  url: link.href,
			  dataType:'html',
			  beforeSend: function()
			  {
			  	loader.css({visibility:'visible'});
			  },
			  success: function(result)
			  {
			  	var newdynamic = jQuery(result).filter('#dynamic-styles'),
			  		bgcontainer = jQuery('.bg_container, .bg_fullscreen_ie_rule');
			  		
			  	if(newdynamic.length)
			  	{
			  		if(bgcontainer.length) bgcontainer.remove();
			  		
			  		link_controller_links.removeClass('avia_link_controller_active');
			  		jQuery(link).addClass('avia_link_controller_active');
			  		newdynamic.insertAfter(dynamic);
			  		dynamic.remove();
			  		loader.css({visibility:'hidden'});
			  	}
			  }
			});
			
			
			
			return false;
		}
		
		
	});
	
	var target = jQuery('.avia_styleswitcher');
	if(jQuery.cookie('avia_display_switch') == 'display_switch_false')
	{
		target.removeClass('display_switch_false').addClass('display_switch');
	}
	else if(jQuery.cookie('avia_display_switch') == 'display_switch')
	{
		target.removeClass('display_switch_false').addClass('display_switch');
	}
	
	

	jQuery('.avia_styleswitcher .openclose').click(function()
	{
		var target = jQuery(this).parent('.avia_styleswitcher');
		var animator = {left: "-297"};
		var animator2 = {left: "-5"};
		
		if(target.is('.display_switch'))
		{
			if(target.is('.switcher_right')) 
			{
				animator = {right: "-5"};
				animator2 = {right: "-297"};
			}
			target.animate(animator, function()
			{
				target.removeClass('display_switch').addClass('display_switch_false');
			});
			
			
			jQuery.cookie('avia_display_switch', 'display_switch_false', { expires: 7, path: '/' });
		}
		else
		{
			if(target.is('.switcher_right')) 
			{
				animator = {right: "-5"};
				animator2 = {right: "-297"};
			}
		
			target.animate(animator2, function()
			{
				target.removeClass('display_switch_false').addClass('display_switch');
			});
			jQuery.cookie('avia_display_switch', 'display_switch', { expires: 7, path: '/' });
		}
	});
	
	
	if( typeof jQuery.cookie('avia_display_switch') != "string")
	{
		setTimeout(function(){jQuery('.avia_styleswitcher .openclose').trigger('click');}, 1000);
	}
	

	
});