package com.openclassrooms.etudiant.service;

import com.openclassrooms.etudiant.entities.User;
import com.openclassrooms.etudiant.repository.UserRepository;
 

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(SpringExtension.class)
public class UserServiceTest {
    private static final String FIRST_NAME = "John";
    private static final String LAST_NAME = "Doe";
    private static final String LOGIN = "LOGIN";
    private static final String PASSWORD = "PASSWORD";
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @InjectMocks
    private UserService userService;

    @Test
    public void test_create_null_user_throws_IllegalArgumentException() {
        // GIVEN

        // THEN
        Assertions.assertThrows(IllegalArgumentException.class,
                () -> userService.register(null));
    }

    @Test
    public void test_create_already_exist_user_throws_IllegalArgumentException() {
        // GIVEN
        User user = new User();
        user.setFirstName(FIRST_NAME);
        user.setLastName(LAST_NAME);
        user.setLogin(LOGIN);
        user.setPassword(PASSWORD);
        when(passwordEncoder.encode(PASSWORD)).thenReturn(PASSWORD);
        when(userRepository.findByLogin(any())).thenReturn(Optional.of(user));

        // THEN
        Assertions.assertThrows(IllegalArgumentException.class,
                () -> userService.register(user));
    }

    @Test
    public void test_create_user() {
        // GIVEN
        User user = new User();
        user.setFirstName(FIRST_NAME);
        user.setLastName(LAST_NAME);
        user.setLogin(LOGIN);
        user.setPassword(PASSWORD);
        when(passwordEncoder.encode(PASSWORD)).thenReturn(PASSWORD);
        when(userRepository.findByLogin(any())).thenReturn(Optional.empty());

        // WHEN
        userService.register(user);

        // THEN
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertThat(userCaptor.getValue()).isEqualTo(user);
    }
    
    
    @Test
    public void delete_shouldDeleteUser_whenUserExists() {
        // GIVEN
        String login = "jdoe";
        User user = new User();
        user.setLogin(login);
        
        // On simule que l'utilisateur est trouvé en base
        when(userRepository.findByLogin(login)).thenReturn(Optional.of(user));

        // WHEN
        userService.delete(login);

        // THEN
        // On vérifie que la méthode deleteByLogin a bien été appelée une fois
        verify(userRepository, times(1)).deleteByLogin(login);
    }
    
    
    @Test
    public void delete_shouldThrowException_whenUserDoesNotExist() {
        // GIVEN
        String login = "unknown";
        
        // On simule que l'utilisateur n'est pas trouvé
        when(userRepository.findByLogin(login)).thenReturn(Optional.empty());

        // WHEN & THEN
        assertThatThrownBy(() -> userService.delete(login))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("L'utilisateur avec le login unknown n'existe pas.");
        
        // On vérifie que la suppression n'a JAMAIS été tentée
        verify(userRepository, never()).deleteByLogin(anyString());
    }
    
    
 // --- TESTS LOGIN ---

    @Test
    void login_Successful() {
        User user = new User();
        user.setLogin("testUser");
        user.setPassword("encodedPassword");

        when(userRepository.findByLogin("testUser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("rawPassword", "encodedPassword")).thenReturn(true);
        when(jwtService.generateToken(any(UserDetails.class))).thenReturn("fake-jwt-token");

        String token = userService.login("testUser", "rawPassword");

        assertThat(token).isEqualTo("fake-jwt-token");
    }

    @Test
    void login_InvalidCredentials_ThrowsException() {
        when(userRepository.findByLogin("any")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.login("any", "pass"))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("Identifiants invalides");
    }

    // --- TESTS READ ---

    @Test
    void read_UserExists_ReturnsUser() {
        User user = new User();
        user.setLogin("jdoe");
        when(userRepository.findByLogin("jdoe")).thenReturn(Optional.of(user));

        Optional<User> result = userService.read("jdoe");

        assertThat(result).isPresent();
        assertThat(result.get().getLogin()).isEqualTo("jdoe");
    }

    @Test
    void read_UserNotFound_ThrowsException() {
        when(userRepository.findByLogin("none")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.read("none"))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("n'existe pas");
    }

    // --- TESTS READLIST ---

    @Test
    void readList_NotEmpty_ReturnsList() {
        when(userRepository.findAll()).thenReturn(List.of(new User()));

        List<User> result = userService.readList();

        assertThat(result).hasSize(1);
    }

    @Test
    void readList_Empty_ThrowsException() {
        when(userRepository.findAll()).thenReturn(Collections.emptyList());

        assertThatThrownBy(() -> userService.readList())
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("Aucun user");
    }

    // --- TESTS UPDATE ---

    @Test
    void update_Successful() {
        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setLogin("oldLogin");

        User updatedInfo = new User();
        updatedInfo.setId(1L);
        updatedInfo.setLogin("newLogin");
        updatedInfo.setFirstName("Jane");
        updatedInfo.setPassword("newPass");

        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
        when(userRepository.findByLogin("newLogin")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("newPass")).thenReturn("encodedNewPass");

        userService.update(updatedInfo);

        verify(userRepository).save(existingUser);
        assertThat(existingUser.getFirstName()).isEqualTo("Jane");
        assertThat(existingUser.getPassword()).isEqualTo("encodedNewPass");
    }

    @Test
    void update_LoginAlreadyTaken_ThrowsException() {
        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setLogin("myLogin");

        User updatedInfo = new User();
        updatedInfo.setId(1L);
        updatedInfo.setLogin("takenLogin");

        User otherUser = new User();
        otherUser.setId(2L); // Un autre utilisateur possède ce login

        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
        when(userRepository.findByLogin("takenLogin")).thenReturn(Optional.of(otherUser));

        assertThatThrownBy(() -> userService.update(updatedInfo))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("déjà utilisé");
    }
    
    
}
