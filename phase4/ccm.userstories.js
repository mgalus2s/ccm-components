ccm.component( {
	name: 'userstories',
	config: {                    // Standardkonfiguration für ccm-Instanzen
		html:  [ ccm.store, { local: 'http://mgalus2s.github.io/ccm-components/phase4/templates.json' } ],  // Einbindung der HTML-Templates
		key: 'userstorybuilder',  // Standardwert für den Schlüssel des zu visualisierenden Datensatzes
		store: [ ccm.store, { local: 'http://mgalus2s.github.io/ccm-components/phase4/dataset.json' } ],       // Abhängigkeit zum ccm-Datenspeicher
		style: [ ccm.load, 'http://mgalus2s.github.io/ccm-components/phase4/style.css' ],  // Einbindung einer CSS-Datei
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

					var new_story_div = ccm.helper.find( self, '.add_story' );     // neue private Variable
					var sort_story_div = ccm.helper.find( self, '.sort_story' );
					var stories_div = ccm.helper.find( self, '.story_entries' ); 

					for ( var i = 0; i < dataset.stories.length; i++ ) {		// Iterierung
						var story = dataset.stories[ i ];
						stories_div.append( ccm.helper.html( self.html.get( 'stories' ), {
							name: ccm.helper.val( story.user ),  // Herausfiltern von Skripten, falls
							story: ccm.helper.val( story.story ),
							value: ccm.helper.val( story.value ),
							punish: ccm.helper.val( story.punish ),
							risk: ccm.helper.val( story.risk ),
							effort: ccm.helper.val( story.effort ),
							prio: ccm.helper.val( story.prio )
							  // der Datensatz manipuliert ist.
						}));
					}


					new_story_div.append( ccm.helper.html( self.html.get( 'input' ), {  // Anhängen des
						onsubmit: function () {						// input-Templates
							var story = ccm.helper.val( ccm.helper.find( self, 'textarea' ).val().trim() );
							var value = ccm.helper.val( ccm.helper.find( self, '.selection_value' ).val().trim() );
							var punish = ccm.helper.val( ccm.helper.find( self, '.selection_punish' ).val().trim() );
							var risk = ccm.helper.val( ccm.helper.find( self, '.selection_risk' ).val().trim() );
							var effort = ccm.helper.val( ccm.helper.find( self, '.selection_effort' ).val().trim() );
							var prio = ccm.helper.val( ccm.helper.find( self, 'input' ).val().trim() );

							if ( story === '' ) return;
							self.user.login( function() {
								dataset.stories.push({ user: self.user.data().key, story: story, value: value, punish: punish, risk: risk, effort: effort, prio: prio,  });        // Lokale Aktualisierung							
								self.store.set( dataset, function () { self.render(); } );
							});
					
							

							return false;                                               // Datenspeicher/Datenbank
						}                                      
					}));

					sort_story_div.append( ccm.helper.html( self.html.get( 'sort' )));

					if ( callback ) callback();
				}
			});
		}
	}
});