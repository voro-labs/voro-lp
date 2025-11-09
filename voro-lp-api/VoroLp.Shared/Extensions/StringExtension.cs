using System.Globalization;

namespace VoroLp.Shared.Extensions
{
    public static class StringExtension
    {
        private static readonly TextInfo TextInfo =
            new CultureInfo("pt-BR", false).TextInfo;

        public static string ToTitleCase(this string value)
        {
            return TextInfo.ToTitleCase(value);
        }

        public static int ToInt32(this string value)
        {
            return Convert.ToInt32(value);
        }
    }
}
