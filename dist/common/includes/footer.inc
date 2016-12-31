					</div><!-- /.contents -->

					<footer>
						<% if( req.session && req.session.userInfo ){ %>
						<div>
							<p><a href="/logout.html" class="btn btn-default">logout</a></p>
						</div>
						<% } %>
						<div>
							<p><a href="https://github.com/passiful/passiflora" target="_blank">passiful/passiflora</a>@<%= conf.packageJson.version %></p>
							<p>Copyright (c)2016 Tomoya Koyanagi, and Passiful Project<br />MIT License https://opensource.org/licenses/mit-license.php</p>
						</div>
					</footer>
				</div>
			</div>
		</div>
