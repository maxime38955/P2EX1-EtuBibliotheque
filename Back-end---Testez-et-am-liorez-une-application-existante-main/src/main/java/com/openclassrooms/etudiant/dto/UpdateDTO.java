package com.openclassrooms.etudiant.dto;

 
import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateDTO {
	@NotBlank
	private Long id;
	@NotBlank
    private String firstName;
	@NotBlank
    private String lastName;
	@NotBlank
    private String login;
	@NotBlank
    private String password;
 

}
