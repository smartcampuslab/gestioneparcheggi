package it.smartcommunitylab.parking.management.web.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public class YamlAuthenticationProvider extends AbstractUserDetailsAuthenticationProvider {

	@Autowired
	YamlUserDetailsService userDetailsService;
	
	@Override
	protected void additionalAuthenticationChecks(UserDetails userDetails, UsernamePasswordAuthenticationToken authentication) throws AuthenticationException {
		if (userDetails != null) {
			authentication.setAuthenticated(true);
		}

	}

	protected final UserDetails retrieveUser(String username,
			UsernamePasswordAuthenticationToken authentication)
			throws AuthenticationException {
		UserDetails loadedUser;

		try {
			loadedUser = this.getUserDetailsService().loadUserByUsername(username);
		}
		catch (UsernameNotFoundException notFound) {
			throw notFound;
		}
		catch (Exception repositoryProblem) {
			throw new InternalAuthenticationServiceException(
					repositoryProblem.getMessage(), repositoryProblem);
		}

		if (loadedUser == null) {
			throw new InternalAuthenticationServiceException(
					"UserDetailsService returned null, which is an interface contract violation");
		}
		
		authentication.setAuthenticated(true);
		return loadedUser;
	}

	public YamlUserDetailsService getUserDetailsService() {
		return userDetailsService;
	}

	public void setUserDetailsService(YamlUserDetailsService userDetailsService) {
		this.userDetailsService = userDetailsService;
	}

}
