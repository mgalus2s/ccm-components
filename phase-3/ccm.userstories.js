ccm.component( {
	name: 'userstories',
	config: {                    // Standardkonfiguration für ccm-Instanzen
		html:  [ ccm.store, { local: 'templates.json' } ],  // Einbindung der HTML-Templates
		key: 'userstorybuilder',  // Standardwert für den Schlüssel des zu visualisierenden Datensatzes
		store: [ ccm.store, { local: 'dataset.json' } ],       // Abhängigkeit zum ccm-Datenspeicher
		style: [ ccm.load, 'style.css' ],  // Einbindung einer CSS-Datei
		user: [ ccm.instance, 'https://kaul.inf.h-brs.de/ccm/components/user2.js' ]
	},
	Instance: function () {
		var self = this;  // Hilfsvariable für einheitlichen Zugriff auf die ccm-Instanz
		self.init = function ( callback ) {
			self.store.onChange = function () { self.render(); };
			callback();
		};
		self.render = function ( callback ) {
			var element = ccm.helper.element( self );
			self.store.get( self.key, function ( dataset ) {
				if ( dataset === null )
					self.store.set( { key: self.key, stories: [] }, proceed );
				else
					proceed( dataset );
				function proceed( dataset ) {
					element.html( ccm.helper.html( self.html.get( 'main' ) ) );
					var messages_div = ccm.helper.find( self, '.main-content' );     // neue private Variable
					for ( var i = 0; i < dataset.stories.length; i++ ) {		// Iterierung
						var story = dataset.stories[ i ];
						messages_div.append( ccm.helper.html( self.html.get( 'stories' ), {
							name: ccm.helper.val( story.user ),  // Herausfiltern von Skripten, falls
							prio: ccm.helper.val( story.prio ),
							story: ccm.helper.val( story.story )   // der Datensatz manipuliert ist.
						}));
					}


					messages_div.append( ccm.helper.html( self.html.get( 'input' ), {  // Anhängen des
						onsubmit: function () {						// input-Templates
							var story = ccm.helper.val( ccm.helper.find( self, 'textarea' ).val().trim() );
							var prio = ccm.helper.val( ccm.helper.find( self, 'input' ).val().trim() );

							if ( story === '' ) return;
							//self.user.login( function() {
								dataset.stories.push({story: story, prio: prio, user: "mgalus2s" });        // Lokale Aktualisierung							
								self.store.set( dataset, function () { self.render(); } );
							//});
					
							

							return false;                                               // Datenspeicher/Datenbank
						}                                      
					}));
					if ( callback ) callback();
				}
			});
		}
	}
});