using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace WebApi.Configuration;

public class RoleConfiguration : IEntityTypeConfiguration<IdentityRole>
{
    public void Configure(EntityTypeBuilder<IdentityRole> builder)
    {
        builder.HasData(
            new IdentityRole
            {
                Id = "16818a94-84e5-4d8b-abc6-670b3702c2f4",
                Name = "Teacher",
                NormalizedName = "TEACHER"
            },
            new IdentityRole
            {
                Id = "7f63cc9d-d208-4897-bfc9-4f5401a4acb2",
                Name = "Student",
                NormalizedName = "STUDENT"
            },
            new IdentityRole
            {
                Id = "9709e011-7150-4380-a8ff-7ce56d6fbf45",
                Name = "Administrator",
                NormalizedName = "ADMINISTRATOR"
            }
        );
    }
}