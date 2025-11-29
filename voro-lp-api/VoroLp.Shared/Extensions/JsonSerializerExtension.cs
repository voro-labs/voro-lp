using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace VoroLp.Shared.Extensions
{
    public static class JsonSerializerExtension
    {
        public static JsonSerializerOptions AsDefault(this JsonSerializerOptions value)
        {
            value.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            value.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            value.PropertyNameCaseInsensitive = true;

            return value;
        }
    }
}
