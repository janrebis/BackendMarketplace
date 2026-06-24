using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendMarketplace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UploadsController : ControllerBase
    {
        private const long MaxFileSizeBytes = 5 * 1024 * 1024;

        private static readonly Dictionary<string, byte[]> ImageSignatures = new()
        {
            [".jpg"] = new byte[] { 0xFF, 0xD8, 0xFF },
            [".jpeg"] = new byte[] { 0xFF, 0xD8, 0xFF },
            [".png"] = new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A },
            [".gif"] = new byte[] { 0x47, 0x49, 0x46, 0x38 },
            [".webp"] = new byte[] { 0x52, 0x49, 0x46, 0x46 } // "RIFF"; WEBP marker checked separately below
        };

        private readonly IWebHostEnvironment _env;

        public UploadsController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpPost("image")]
        [RequestSizeLimit(MaxFileSizeBytes)]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Nie wybrano pliku.");

            if (file.Length > MaxFileSizeBytes)
                throw new ArgumentException("Plik jest zbyt duży. Maksymalny rozmiar to 5 MB.");

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!ImageSignatures.ContainsKey(extension))
                throw new ArgumentException("Nieobsługiwany format pliku. Dozwolone: JPG, PNG, GIF, WEBP.");

            var header = new byte[12];
            using (var stream = file.OpenReadStream())
            {
                await stream.ReadAtLeastAsync(header, header.Length, throwOnEndOfStream: false);
            }

            if (!IsValidImageSignature(extension, header))
                throw new ArgumentException("Plik nie jest prawidłowym obrazem - jego zawartość nie zgadza się z rozszerzeniem.");

            var uploadsPath = Path.Combine(_env.WebRootPath, "Uploads");
            Directory.CreateDirectory(uploadsPath);

            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsPath, fileName);

            using (var output = new FileStream(filePath, FileMode.Create))
            using (var input = file.OpenReadStream())
            {
                await input.CopyToAsync(output);
            }

            return Ok(new { url = $"/Uploads/{fileName}" });
        }

        private static bool IsValidImageSignature(string extension, byte[] header)
        {
            if (extension == ".webp")
            {
                return header[0] == 'R' && header[1] == 'I' && header[2] == 'F' && header[3] == 'F'
                    && header[8] == 'W' && header[9] == 'E' && header[10] == 'B' && header[11] == 'P';
            }

            var signature = ImageSignatures[extension];
            return header.Take(signature.Length).SequenceEqual(signature);
        }
    }
}
