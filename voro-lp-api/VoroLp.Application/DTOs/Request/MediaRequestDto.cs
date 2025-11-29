using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http;

namespace VoroLp.Application.DTOs.Request
{
    public class MediaRequestDto
    {
        public MediaRequestDto()
        {
        }

        public MediaRequestDto(string number, string caption, string mediaBase64, MediaDto media)
        {
            this.Number = number;
            this.Mediatype = media.Mediatype;
            this.Mimetype = media.Mimetype;
            this.Caption = caption;
            this.Media = mediaBase64;
            this.FileName = media.FileName;
        }
        
        public string Number { get; set; } = string.Empty; // "remoteJid";
        public string Mediatype { get; set; } = string.Empty; // "image";
        public string Mimetype { get; set; } = string.Empty; // "image/png";
        public string Caption { get; set; } = string.Empty; // "Teste de caption";
        public string Media { get; set; } = string.Empty; // "https://s3.amazonaws.com/atendai/company-3708fcdf-954b-48f8-91ff-25babaccac67/1712605171932.jpeg";
        public string FileName { get; set; } = string.Empty; // "Imagem.png";
    }
}
