using Microsoft.AspNetCore.Http;

namespace VoroLp.Application.DTOs
{
    public class MediaDto
    {
        public MediaDto()
        {
            
        }

        public MediaDto(IFormFile? attachment)
        {
            this.Attachment = attachment;
        }

        public IFormFile? Attachment { get; set; } = null;

        public string FileName => this.Attachment?.FileName ?? string.Empty; // "Imagem.png";
        public string Mimetype => this.Attachment?.ContentType ?? string.Empty; // "image/png";
        public Stream? MediaStream 
        {
            get
            {
                if (this.Attachment == null)
                {
                    return null;
                }

                return this.Attachment?.OpenReadStream();
            }
        }
        public string Mediatype 
        {
            get
            {
                if (this.Attachment == null)
                {
                    return string.Empty;
                }

                return this.Attachment.ContentType switch
                {
                    "image/png" => "image",
                    "image/jpeg" => "image",
                    "image/gif" => "image",
                    "video/mp4" => "video",
                    "video/3gpp" => "video",
                    "video/quicktime" => "video",
                    "audio/mpeg" => "audio",
                    "audio/ogg" => "audio",
                    "audio/wav" => "audio",
                    "audio/aac" => "audio",
                    "application/pdf" => "document",
                    "application/msword" => "document",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" => "document",
                    "application/vnd.ms-excel" => "document",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" => "document",
                    "application/vnd.ms-powerpoint" => "document",
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation" => "document",
                    "application/zip" => "document",
                    "application/x-rar-compressed" => "document",
                    "application/x-tar" => "document",
                    "application/x-7z-compressed" => "document",
                    "application/octet-stream" => "document",
                    "text/plain" => "document",
                    _ => string.Empty,
                };
            }
        } // "image";
    }
}


