using System.Text.Json;
using System.Text.Json.Serialization;
using VoroLp.Application.DTOs.Evolution.Webhook.Base;
using VoroLp.Shared.Converters;

namespace VoroLp.Application.DTOs.Evolution.Webhook
{
    public class MessageUpsertEventDto : EvolutionEventDto<MessageUpsertDataDto>
    {
    }

    public class MessageUpsertDataDto
    {
        [JsonPropertyName("key")]
        public MessageKeyDto Key { get; set; } = new();

        [JsonPropertyName("pushName")]
        public string PushName { get; set; } = string.Empty;

        [JsonPropertyName("status")]
        public string Status { get; set; } = string.Empty;

        [JsonPropertyName("message")]
        public MessageContentDto Message { get; set; } = new();

        [JsonPropertyName("contextInfo")]
        public ContextInfoDto? ContextInfo { get; set; }

        [JsonPropertyName("messageType")]
        public string MessageType { get; set; } = string.Empty;

        [JsonPropertyName("messageTimestamp")]
        public long MessageTimestamp { get; set; }

        [JsonPropertyName("instanceId")]
        public string InstanceId { get; set; } = string.Empty;

        [JsonPropertyName("source")]
        public string Source { get; set; } = string.Empty;
    }

    public class MessageKeyDto
    {
        [JsonPropertyName("remoteJid")]
        public string RemoteJid { get; set; } = string.Empty;

        [JsonPropertyName("remoteJidAlt")]
        public string? RemoteJidAlt { get; set; }

        [JsonPropertyName("fromMe")]
        public bool FromMe { get; set; }

        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;

        [JsonPropertyName("participant")]
        public string Participant { get; set; } = string.Empty;

        [JsonPropertyName("addressingMode")]
        public string? AddressingMode { get; set; }
    }

    public class MessageContentDto
    {
        [JsonPropertyName("conversation")]
        public string? Conversation { get; set; }

        [JsonPropertyName("imageMessage")]
        public MediaMessageDto? ImageMessage { get; set; }

        [JsonPropertyName("videoMessage")]
        public MediaMessageDto? VideoMessage { get; set; }
        
        [JsonPropertyName("reactionMessage")]
        public ReactionMessageDto? ReactionMessage { get; set; }

        [JsonPropertyName("messageContextInfo")]
        public MessageContextInfoDto? MessageContextInfo { get; set; }

        [JsonPropertyName("base64")]
        public string? Base64 { get; set; }
    }

    public class ReactionMessageDto
    {
        [JsonPropertyName("key")]
        public MessageKeyDto Key { get; set; } = new();

        [JsonPropertyName("text")]
        public string Text { get; set; } = string.Empty;

        [JsonPropertyName("senderTimestampMs")]
        public long SenderTimestampMs { get; set; }
    }

    public class MediaMessageDto
    {
        [JsonPropertyName("url")]
        public string? Url { get; set; }

        [JsonPropertyName("mimetype")]
        public string? MimeType { get; set; }

        [JsonPropertyName("fileSha256")]
        [JsonConverter(typeof(ByteArrayFromObjectConverter))]
        public byte[]? FileSha256 { get; set; }

        [JsonPropertyName("fileEncSha256")]
        [JsonConverter(typeof(ByteArrayFromObjectConverter))]
        public byte[]? FileEncSha256 { get; set; }

        [JsonPropertyName("fileLength")]
        public MediaFileLengthDto? FileLength { get; set; }

        [JsonPropertyName("mediaKey")]
        [JsonConverter(typeof(ByteArrayFromObjectConverter))]
        public byte[]? MediaKey { get; set; }

        [JsonPropertyName("mediaKeyTimestamp")]
        public MediaKeyTimestampDto? MediaKeyTimestamp { get; set; }

        [JsonPropertyName("width")]
        public int? Width { get; set; }

        [JsonPropertyName("height")]
        public int? Height { get; set; }

        [JsonPropertyName("seconds")]
        public int? Seconds { get; set; }

        [JsonPropertyName("jpegThumbnail")]
        [JsonConverter(typeof(ByteArrayFromObjectConverter))]
        public byte[]? JpegThumbnail { get; set; }

        [JsonPropertyName("contextInfo")]
        public MediaContextInfoDto? ContextInfo { get; set; }

        [JsonPropertyName("interactiveAnnotations")]
        public JsonElement[]? InteractiveAnnotations { get; set; }

        [JsonPropertyName("annotations")]
        public JsonElement[]? Annotations { get; set; }

        [JsonPropertyName("processedVideos")]
        public JsonElement[]? ProcessedVideos { get; set; }
    }

    public class MediaFileLengthDto
    {
        [JsonPropertyName("low")]
        public long Low { get; set; }

        [JsonPropertyName("high")]
        public long High { get; set; }

        [JsonPropertyName("unsigned")]
        public bool Unsigned { get; set; }
    }

    public class MediaKeyTimestampDto
    {
        [JsonPropertyName("low")]
        public long Low { get; set; }

        [JsonPropertyName("high")]
        public long High { get; set; }

        [JsonPropertyName("unsigned")]
        public bool Unsigned { get; set; }
    }

    public class MediaContextInfoDto
    {
        [JsonPropertyName("mentionedJid")]
        public string[]? MentionedJid { get; set; }

        [JsonPropertyName("groupMentions")]
        public string[]? GroupMentions { get; set; }

        [JsonPropertyName("pairedMediaType")]
        public int? PairedMediaType { get; set; }

        [JsonPropertyName("statusSourceType")]
        public int? StatusSourceType { get; set; }
    }

    public class MessageContextInfoDto
    {
        [JsonPropertyName("messageSecret")]
        [JsonConverter(typeof(ByteArrayFromObjectConverter))]
        public byte[]? MessageSecret { get; set; }

        [JsonPropertyName("deviceListMetadata")]
        public DeviceListMetadataDto? DeviceListMetadata { get; set; }

        [JsonPropertyName("deviceListMetadataVersion")]
        public int? DeviceListMetadataVersion { get; set; }

        [JsonPropertyName("stanzaId")]
        public string? StanzaId { get; set; }
    }

    public class DeviceListMetadataDto
    {
        [JsonPropertyName("senderKeyIndexes")]
        public int[]? SenderKeyIndexes { get; set; }

        [JsonPropertyName("recipientKeyIndexes")]
        public int[]? RecipientKeyIndexes { get; set; }

        [JsonPropertyName("recipientKeyHash")]
        [JsonConverter(typeof(ByteArrayFromObjectConverter))]
        public byte[]? RecipientKeyHash { get; set; }

        [JsonPropertyName("recipientTimestamp")]
        public MediaKeyTimestampDto? RecipientTimestamp { get; set; }
    }

    public class ContextInfoDto
    {
        [JsonPropertyName("mentionedJid")]
        public string[]? MentionedJid { get; set; }

        [JsonPropertyName("groupMentions")]
        public string[]? GroupMentions { get; set; }

        [JsonPropertyName("stanzaId")]
        public string? StanzaId { get; set; }

        [JsonPropertyName("participant")]
        public string Participant { get; set; } = string.Empty;

        [JsonPropertyName("quotedMessage")]
        public MessageContentDto? QuotedMessage { get; set; }
    }
}
