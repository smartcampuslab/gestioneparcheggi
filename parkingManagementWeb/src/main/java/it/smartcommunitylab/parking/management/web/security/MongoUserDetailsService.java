/*******************************************************************************
 * Copyright 2015 Fondazione Bruno Kessler
 * 
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 * 
 *        http://www.apache.org/licenses/LICENSE-2.0
 * 
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 ******************************************************************************/
package it.smartcommunitylab.parking.management.web.security;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import it.smartcommunitylab.parking.management.web.model.ObjectShowSetting;
import it.smartcommunitylab.parking.management.web.model.UserSetting;

@Component
public class MongoUserDetailsService implements UserDetailsService {

    //@Autowired
    //private UserRepositoryDao userRepositoryDao;
    
    @Autowired
	private ObjectShowSetup objectShowSetup;
    
    @Autowired
	private UserSetup userSetup;
    
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
        //System.out.println(user.getRole());
        
        UserSetting myUser = userSetup.findUserByUsername(username);
        if(myUser != null){
        	objectShowSetup.setApp_id(myUser.getAppId());
        	logger.info(String.format("username : %s", myUser.getUsername()));
        	logger.info(String.format("pwd : %s", myUser.getPassword()));
            
            userdetails = new User(myUser.getUsername(), 
            				myUser.getPassword(),
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

    //public it.smartcommunitylab.parking.management.web.repository.User getUserDetail(String username) {
    //	it.smartcommunitylab.parking.management.web.repository.User user = userRepositoryDao.findByUsername(username);
        //System.out.println(user.toString());
    //    return user;
    //}
    
    public UserSetting getUserDetails(String username){
    	return userSetup.findUserByUsername(username);
    }
    
    public ObjectShowSetting getObjectShowDetails(String username){
    	UserSetting user = userSetup.findUserByUsername(username);
    	return objectShowSetup.findProviderByAppId(user.getAppId());
    }
    
    public ObjectShowSetting getObjectShowDetailsByAppId(String appId){
    	return objectShowSetup.findProviderByAppId(appId);
    }

   
}