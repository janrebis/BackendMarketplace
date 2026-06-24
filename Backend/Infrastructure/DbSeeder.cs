using BackendMarketplace.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BackendMarketplace.Data
{
    public static class DbSeeder
    {
        private const string SeedUserEmail = "test@gmail.com";
        private const string SeedUserPassword = "testpass1!";

        public static async Task SeedAsync(IServiceProvider services)
        {
            var db = services.GetRequiredService<ApplicationDbContext>();
            var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();

            if (await db.Products.AnyAsync())
                return;

            var seedUser = await userManager.FindByEmailAsync(SeedUserEmail);

            if (seedUser == null)
            {
                seedUser = new ApplicationUser
                {
                    UserName = "demo_seller",
                    Email = SeedUserEmail,
                    EmailConfirmed = true
                };

                // Identity's default password policy (e.g. RequireUppercase) would reject
                // the requested seed password, so hash it directly and create the user
                // without running the password validators - login still works normally
                // because the hash is produced by the same PasswordHasher Identity uses.
                seedUser.PasswordHash = new PasswordHasher<ApplicationUser>()
                    .HashPassword(seedUser, SeedUserPassword);

                var result = await userManager.CreateAsync(seedUser);

                if (!result.Succeeded)
                    throw new InvalidOperationException(
                        $"Failed to create seed user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }

            db.Products.AddRange(BuildSeedProducts(seedUser.Id));
            await db.SaveChangesAsync();
        }

        private static List<ProductModel> BuildSeedProducts(string ownerId) => new()
        {
            new ProductModel
            {
                OwnerId = ownerId,
                Name = "Słuchawki Sony WH-1000XM4",
                Price = 899.99m,
                Description = "Bezprzewodowe słuchawki nauszne z aktywną redukcją szumów i do 30 godzin pracy na baterii.",
                ImageUrl = "/Assets/słuchawki_sony.jpg",
                Category = ProductCategory.Elektronika
            },
            new ProductModel
            {
                OwnerId = ownerId,
                Name = "Klawiatura Keychron K8",
                Price = 449.00m,
                Description = "Mechaniczna klawiatura hot-swap z przełącznikami Gateron i podświetleniem RGB.",
                ImageUrl = "/Assets/klawiatura_keychrone.jpg",
                Category = ProductCategory.Elektronika
            },
            new ProductModel
            {
                OwnerId = ownerId,
                Name = "Buty do biegania Nike Air Zoom",
                Price = 549.00m,
                Description = "Lekkie buty do biegania z amortyzacją Zoom Air, idealne na dłuższe dystanse.",
                ImageUrl = "/Assets/nikeair.webp",
                Category = ProductCategory.Sport
            },
            new ProductModel
            {
                OwnerId = ownerId,
                Name = "Plecak Fjällräven Kånken",
                Price = 379.00m,
                Description = "Pojemny i wytrzymały plecak miejski, idealny do codziennego użytku.",
                ImageUrl = "/Assets/plecak_fjervallen.webp",
                Category = ProductCategory.OdziezIAkcesoria
            },
            new ProductModel
            {
                OwnerId = ownerId,
                Name = "Ekspres DeLonghi Magnifica",
                Price = 1799.00m,
                Description = "Automatyczny ekspres do kawy z wbudowanym młynkiem do ziaren.",
                ImageUrl = "/Assets/eksper_de_longi.jpg",
                Category = ProductCategory.DomIOgrod
            },
            new ProductModel
            {
                OwnerId = ownerId,
                Name = "Lampka LED Xiaomi Mi",
                Price = 129.00m,
                Description = "Regulowana lampka biurkowa LED z ochroną przed migotaniem światła.",
                ImageUrl = "/Assets/lampka_led_xiaomi.jpg",
                Category = ProductCategory.DomIOgrod
            },
            new ProductModel
            {
                OwnerId = ownerId,
                Name = "Okulary Ray-Ban Aviator",
                Price = 699.00m,
                Description = "Klasyczne okulary przeciwsłoneczne typu aviator z polaryzacją.",
                ImageUrl = "/Assets/ray_ban_aviator.webp",
                Category = ProductCategory.OdziezIAkcesoria
            },
            new ProductModel
            {
                OwnerId = ownerId,
                Name = "Smartwatch Garmin Venu 3",
                Price = 1599.00m,
                Description = "Zegarek sportowy z GPS, pulsometrem i monitorowaniem snu.",
                ImageUrl = "/Assets/garmin_smartwatch.jpg",
                Category = ProductCategory.Elektronika
            },
            new ProductModel
            {
                OwnerId = ownerId,
                Name = "Zestaw kosmetyków do twarzy Nivea",
                Price = 89.00m,
                Description = "Krem na dzień, krem na noc i żel do mycia twarzy w wygodnym zestawie.",
                ImageUrl = string.Empty,
                Category = ProductCategory.Uroda
            },
            new ProductModel
            {
                OwnerId = ownerId,
                Name = "Władca Pierścieni - Trylogia (komplet)",
                Price = 99.00m,
                Description = "Komplet trzech tomów kultowej trylogii J.R.R. Tolkiena w twardej oprawie.",
                ImageUrl = string.Empty,
                Category = ProductCategory.KsiazkiIMultimedia
            },
            new ProductModel
            {
                OwnerId = ownerId,
                Name = "Wycieraczki samochodowe Bosch Aerotwin",
                Price = 129.00m,
                Description = "Komplet wycieraczek przednich, uniwersalne mocowanie, cichy i równy skok.",
                ImageUrl = string.Empty,
                Category = ProductCategory.Motoryzacja
            },
            new ProductModel
            {
                OwnerId = ownerId,
                Name = "Klocki LEGO Technic",
                Price = 349.00m,
                Description = "Zaawansowany zestaw klocków konstrukcyjnych dla dzieci i dorosłych fanów motoryzacji.",
                ImageUrl = string.Empty,
                Category = ProductCategory.Zabawki
            }
        };
    }
}
