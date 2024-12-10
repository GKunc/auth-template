using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace WebApi.Configuration;

public class AdminRoleConfiguration : IEntityTypeConfiguration<IdentityUserRole<string>>
{
    public void Configure(EntityTypeBuilder<IdentityUserRole<string>> builder)
    {
        builder.HasData(
            new IdentityUserRole<string>
            {
                UserId = "a88d0ad8-82aa-4607-849e-4cdcf96aac86",
                RoleId = "12267ba1-b98d-4503-b3fd-0cd31080d806" 
            }
        );
    }
}