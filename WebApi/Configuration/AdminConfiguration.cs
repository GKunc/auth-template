using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebApi.Entities;

namespace WebApi.Configuration;

public class AdminConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        var hasher = new PasswordHasher<User>();

        var adminUser = new User
        {
            Id = "a88d0ad8-82aa-4607-849e-4cdcf96aac86",
            UserName = "admin",
            NormalizedUserName = "ADMIN",
            Email = "admin@example.com",
            NormalizedEmail = "ADMIN@EXAMPLE.COM",
            EmailConfirmed = true,
            TwoFactorEnabled = false,
            PhoneNumberConfirmed = false,
            SecurityStamp = Guid.NewGuid().ToString(),
        };

        adminUser.PasswordHash = hasher.HashPassword(adminUser, "Test1234!");

        Console.WriteLine($"Seeded admin user: {adminUser.UserName}, hash: {adminUser.PasswordHash}"); // Debug Log
        builder.HasData(adminUser);
    }
}