package it.smartcommunitylab.parking.management.web.security;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import it.smartcommunitylab.parking.management.web.model.ProviderSetting;
import it.smartcommunitylab.parking.management.web.repository.UserRepositoryDao;

@Component
public class MongoUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepositoryDao userRepositoryDao;
    
    @Autowired
	private ProviderSetup appSetup;
    
    private static final Logger logger = Logger.getLogger(MongoUserDetailsService.class);
    private static final Integer role = 1;
    
private org.springframework.security.core.userdetails.User userdetails;

    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
        boolean enabled = true;
        boolean accountNonExpired = true;
        boolean credentialsNonExpired = true;
        boolean accountNonLocked = true;
        //it.smartcommunitylab.parking.management.web.repository.User user = getUserDetail(username);
        //System.out.println(user.getUsername());
        //System.out.println(user.getRole());
           
        ProviderSetting prov = appSetup.findProviderByUsername(username);
        if(prov != null){
        	appSetup.setApp_id(prov.getAppId());
        	System.out.println(prov.getUser());
            System.out.println(prov.getPassword());
            
            userdetails = new User(prov.getUser(), 
            				prov.getPassword(),
     			   			enabled,
     			   			accountNonExpired,
     			   			credentialsNonExpired,
     			   			accountNonLocked,
     			   			getAuthorities(role));
        }
        
        
            
//            userdetails = new User(user.getUsername(), 
//            					   user.getPassword(),
//    		        			   enabled,
//    		        			   accountNonExpired,
//    		        			   credentialsNonExpired,
//    		        			   accountNonLocked,
//    		        			   getAuthorities(user.getRole()));
            return userdetails;
    }

    public List<GrantedAuthority> getAuthorities(Integer role) {
        List<GrantedAuthority> authList = new ArrayList<GrantedAuthority>();
        if (role.intValue() == 1) {
            authList.add(new SimpleGrantedAuthority("ROLE_ADMIN"));

        } else if (role.intValue() == 2) {
            authList.add(new SimpleGrantedAuthority("ROLE_CAMPAIGN"));
        }
        System.out.println(authList);
        return authList;
    }

    public it.smartcommunitylab.parking.management.web.repository.User getUserDetail(String username) {
    	it.smartcommunitylab.parking.management.web.repository.User user = userRepositoryDao.findByUsername(username);
        //System.out.println(user.toString());
        return user;
    }
    
    public ProviderSetting getProvDetails(String username){
    	return appSetup.findProviderByUsername(username);
    }

   
}