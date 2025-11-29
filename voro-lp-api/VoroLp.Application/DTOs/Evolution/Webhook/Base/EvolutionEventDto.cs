using System.Text.Json.Serialization;

namespace VoroLp.Application.DTOs.Evolution.Webhook.Base
{
    public class EvolutionEventDto<T>
    {
        [JsonPropertyName("event")]
        public string Event { get; set; } = string.Empty;

        [JsonPropertyName("instance")]
        public string Instance { get; set; } = string.Empty;

        [JsonPropertyName("data")]
        public T Data { get; set; } = default!;

        [JsonPropertyName("destination")]
        public string Destination { get; set; } = string.Empty;

        [JsonPropertyName("date_time")]
        public DateTime DateTime { get; set; }

        [JsonPropertyName("sender")]
        public string Sender { get; set; } = string.Empty;

        [JsonPropertyName("server_url")]
        public string ServerUrl { get; set; } = string.Empty;

        [JsonPropertyName("apikey")]
        public string ApiKey { get; set; } = string.Empty;
    }
}
