﻿using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.OAuth.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SurveyScrubAPI.DTO;
using SurveyScrubAPI.Models;
using SurveyScrubAPI.Repositories.Interfaces;

namespace SurveyScrubAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        public AuthController(IAuthRepository repo, IConfiguration config)
        {
            _repo = repo;
            _config = config;
        }

        // Register new user account
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDto userDto)
        {
            userDto.Email = userDto.Email.ToLower();
            userDto.Password = userDto.Password.ToLower();

            if (await _repo.UserExists(userDto.Email))
            {
                return BadRequest("An account with this email already exists");
            }

            else
            {
                var newUser = new User();

                newUser.FirstName = userDto.FirstName;
                newUser.LastName = userDto.LastName;
                newUser.Email = userDto.Email;
                newUser.CompanyName = userDto.CompanyName;
                newUser.Sector = userDto.Sector;
                newUser.CompanyId = Guid.NewGuid();

                var password = userDto.Password;

                await _repo.Register(newUser, password);

                return StatusCode(201);
            }
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<User>> Login(UserLoginDto userLoginDto)
        {

            var email = userLoginDto.Email.ToString();
            var password = userLoginDto.Password.ToString();

            var userFromRepo = await _repo.Login(email, password);

            if (userFromRepo == null)
            {
                return Unauthorized();
            }
            else
            {
                //var claims = new[]
                //{
                //    new Claim(ClaimTypes.NameIdentifier, userFromRepo.InstanceId.ToString()),
                //    new Claim(ClaimTypes.Name, userFromRepo.Email)
                //};

                //var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));

                //var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

                //var tokenDescriptor = new SecurityTokenDescriptor
                //{
                //    Subject = new ClaimsIdentity(claims),
                //    Expires = DateTime.Now.AddDays(1),
                //    SigningCredentials = creds
                //};

                //var tokenHandler = new JwtSecurityTokenHandler();
                //var token = tokenHandler.CreateToken(tokenDescriptor);

                //return Ok(new
                //{
                //    token = tokenHandler.WriteToken(token)
                //});

                return userFromRepo;
            }
        }
    }
}