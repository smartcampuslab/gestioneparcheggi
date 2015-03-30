package it.smartcommunitylab.parking.management.web.repository;

import org.springframework.data.repository.CrudRepository;

import it.smartcommunitylab.parking.management.web.repository.User;

public interface UserRepositoryDao extends CrudRepository<User, String>{
	
	public User findByUsername(String username);
	
}
