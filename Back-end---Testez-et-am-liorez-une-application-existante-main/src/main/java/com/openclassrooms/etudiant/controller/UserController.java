package com.openclassrooms.etudiant.controller;

import com.openclassrooms.etudiant.dto.LoginRequestDTO;
import com.openclassrooms.etudiant.dto.RegisterDTO;
import com.openclassrooms.etudiant.dto.UpdateDTO;
import com.openclassrooms.etudiant.entities.User;
import com.openclassrooms.etudiant.mapper.UserDtoMapper;
import com.openclassrooms.etudiant.service.UserService;
import com.openclassrooms.etudiant.entities.User;
 

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserDtoMapper userDtoMapper;

    @PostMapping("/api/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterDTO registerDTO) {
        userService.register(userDtoMapper.toEntity(registerDTO));
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequestDTO) {
    	String jwtToken = userService.login(loginRequestDTO.getLogin(), loginRequestDTO.getPassword());
        return ResponseEntity.ok(jwtToken);
    }
     

    @PatchMapping("/api/update")
    public ResponseEntity<?> update(@RequestBody UpdateDTO updateDTO) {
    	   try {
    	userService.update(userDtoMapper.updateEntityFromDto(updateDTO));
    	return new ResponseEntity<>(HttpStatus.OK);
    	   } catch (IllegalArgumentException e) {
    		   return new ResponseEntity<>(HttpStatus.FORBIDDEN);
           }
    }

    @DeleteMapping("/api/delete/{login}")
    public ResponseEntity<?> deleteUser(@PathVariable String login) {
        try {
            userService.delete(login);
            // On renvoie un petit JSON de confirmation
            return ResponseEntity.ok(Map.of("message", "Utilisateur supprimé"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/api/read/{login}")
    public ResponseEntity<?> read(@PathVariable String login) {
    	Optional<User> user = userService.read(login);
        return ResponseEntity.ok(user);
    }
    
    @GetMapping("/api/readlist")
    public ResponseEntity<?> readList() {
    	 
    	List<User> userList = userService.readList();
        return ResponseEntity.ok(userList);
    	  
    }


}
