namespace WebApi.Services
{
    public static class PasswordGenerator
    {
        private static readonly Random random = new Random();
        public static string GeneratePassword(int length, int numberOfNonAlphanumericCharacters)
        {
            if (length < 1 || numberOfNonAlphanumericCharacters < 0 || numberOfNonAlphanumericCharacters > length)
                throw new ArgumentException("Nieprawidłowe parametry generowania hasła.");
            const string letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string digits = "0123456789";
            const string alphanumeric = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            const string nonAlphanumeric = "!@#$%^&*()-_=+[]{};:,.<>?";
            var passwordChars = new List<char>();
            // Dodaj co najmniej jedną literę
            passwordChars.Add(letters[random.Next(letters.Length)]);
            // Dodaj co najmniej jedną cyfrę
            passwordChars.Add(digits[random.Next(digits.Length)]);
            int nonAlphaCount = numberOfNonAlphanumericCharacters;
            int remainingLength = length - 2;
            if (nonAlphaCount > remainingLength)
                nonAlphaCount = remainingLength;
            for (int i = 0; i < nonAlphaCount; i++)
                passwordChars.Add(nonAlphanumeric[random.Next(nonAlphanumeric.Length)]);
            for (int i = nonAlphaCount + 2; i < length; i++)
                passwordChars.Add(alphanumeric[random.Next(alphanumeric.Length)]);
            return new string(passwordChars.OrderBy(_ => random.Next()).ToArray());
        }
    }
}

