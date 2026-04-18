package com.openclassrooms.etudiant.service;

import com.openclassrooms.etudiant.dto.RegisterDTO;
import com.openclassrooms.etudiant.dto.UpdateDTO;
import com.openclassrooms.etudiant.entities.User;
import com.openclassrooms.etudiant.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
 

    public void register(User user) {
        Assert.notNull(user, "User must not be null");
        log.info("Registering new user");
        
        Optional<User> optionalUser = userRepository.findByLogin(user.getLogin());
        if (optionalUser.isPresent()) {
            throw new IllegalArgumentException("User with login " + user.getLogin() + " already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }


    public String login(String login, String password) {
      
        Assert.notNull(login, "Login must not be null"); // Correction du message
        Assert.notNull(password, "Password must not be null");
        
        log.info("Tentative de connexion pour l'utilisateur : {}", login); // On ne logue plus le password !

        
        Optional<User> userOptional = userRepository.findByLogin(login);

        
        if (userOptional.isPresent() && passwordEncoder.matches(password, userOptional.get().getPassword())) {
            
            User user = userOptional.get();
            
      
            UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                    .username(user.getLogin())
                    .password(user.getPassword()) 
                    .authorities("ROLE_USER")    
                    .build();

            return jwtService.generateToken(userDetails);
        } else {
        
            throw new IllegalArgumentException("Identifiants invalides");
        }
    }
    
    public   Optional<User> read(String login) {
    	 Assert.hasText(login, "Le login ne doit pas être vide");
         log.info("Tentative de lecture de l'utilisateur : " + login);
      
         Optional<User> optionalUser = userRepository.findByLogin(login);
         
         if (optionalUser.isEmpty()) {
            
             throw new IllegalArgumentException("L'utilisateur avec le login " + login + " n'existe pas.");
         }
         userRepository.findByLogin(login);
         log.info("Utilisateur " + login + " affiché avec succès.");
    	return optionalUser;
    	
    }
    
    
    public    List<User> readList() {
    
        log.info("Tentative de lecture de la liste d'utilisateur ");
        List<User> listUser = userRepository.findAll();
        
        if (listUser.isEmpty()) {
            throw new IllegalArgumentException("Aucun user");
        }else
        log.info("Liste utilisateur affiché avec succès.");
        
   	return listUser;
   	
   }
    
    @Transactional 
    public void update(User user) {
        log.info("Tentative d'update de l'utilisateur ID: {}", user.getId());

     
        User existingUser = userRepository.findById(user.getId())
            .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable avec l'ID " + user.getId()));

        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());

        Optional<User> loginOwner = userRepository.findByLogin(user.getLogin());
        
        if (loginOwner.isEmpty() || Objects.equals(user.getLogin(), existingUser.getLogin())) {
            existingUser.setLogin(user.getLogin());
        } else {
            throw new IllegalArgumentException("Le login " + user.getLogin() + " est déjà utilisé par un autre utilisateur.");
        }
   
        existingUser.setUpdated_at(LocalDateTime.now());
 
        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
        }
      
        userRepository.save(existingUser);
    }
    
    public void delete(String login) {
 
        Assert.hasText(login, "Le login ne doit pas être vide");
        log.info("Tentative de suppression de l'utilisateur : " + login);

        Optional<User> optionalUser = userRepository.findByLogin(login);
        
        if (optionalUser.isEmpty()) {
            throw new IllegalArgumentException("L'utilisateur avec le login " + login + " n'existe pas.");
        }

    
        userRepository.deleteByLogin(login);
        log.info("Utilisateur " + login + " supprimé avec succès.");
    }
    	
    	
        


}
