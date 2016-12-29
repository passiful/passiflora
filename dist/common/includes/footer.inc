					</div><!-- /.contents -->

					<footer>
						<% if( req.session && req.session.userInfo ){ %>
						<div>
							<p><a href="/logout.html" class="btn btn-default">logout</a></p>
						</div>
						<% } %>
					</footer>
				</div>
			</div>
		</div>
