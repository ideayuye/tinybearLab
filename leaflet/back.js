<Map className="map" center={this.state.leafletCenter}
							 style={{
								 "position": "absolute",
								 "top": 0,
								 "bottom": 0,
								 "left": (this.state.treeData.length > 0) ? 180 : 0,
								 "right": 0,
								 "borderLeft": "1px solid #ccc"
							 }} zoom={14} maxZoom={18} minZoom={12} zoomControl={false} maxBounds={[[22.605741,113.736069],[22.442025,114.10459]]}>
							<TileLayer url={this.state.TileLayerUrl} attribution={'&copy;<a href="">ecidi</a>'}
									   subdomains={this.subDomains}/>
							<WMSTileLayer url={this.WMSTileLayerUrl} subdomains={this.subDomains}/>
							<ZoomControl position='bottomright'/>
							{
								this.state.geoData.map((geo, index) => {
									if (geo.properties.type !== 'area') {
										return (
										  <ExtendedMarker key={index}
														  icon={L.divIcon({className: styles[this.getIconType(geo.type)]})}
														  position={geo.geometry.coordinates.reverse()}>
											  <Popup  maxHeight={500}>
												  {
												  	this.renderPopUpContent(geo)
												  }
											  </Popup>
										  </ExtendedMarker>
										)
									} else if (geo.properties.type === 'area') {
										const that=this;
										return (
										  <ExtendedGeoJSON key={index} data={geo}
														   style={{
															   fillColor: this.fillAreaColor(index),
															   weight: 1,
															   opacity: 1,
															   color: '#201ffd',
															   fillOpacity: 0.3
														   }}
														   onEachFeature={(feature, layer) => {
															   let latlng = layer.getBounds().getCenter();
															   let label = L.marker([latlng.lat, latlng.lng], {
																   icon: L.divIcon({
																	   className: styles['label-text'],
																	   html: feature.properties.name,
																	   iconSize: [48, 20]
																   })
															   }).addTo(layer.options.map);
															   Labels.push(label);
															   layer.on({
																   click: function (event) {
																	   that.previewFile(feature.file_info)
																	   let popup = L.popup()
																		 .setLatLng(event.latlng)
																		 .setContent(geo.properties.name)
																		 .openOn(layer._map);
																   }
															   });
														   }}
										  />
										)
									}
								})
							}
						</Map>