FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["VoroLp.API/VoroLp.API.csproj", "VoroLp.API/"]
COPY ["VoroLp.Application/VoroLp.Application.csproj", "VoroLp.Application/"]
COPY ["VoroLp.Domain/VoroLp.Domain.csproj", "VoroLp.Domain/"]
COPY ["VoroLp.Infrastructure/VoroLp.Infrastructure.csproj", "VoroLp.Infrastructure/"]
COPY ["VoroLp.Shared/VoroLp.Shared.csproj", "VoroLp.Shared/"]
RUN dotnet restore "VoroLp.API/VoroLp.API.csproj"
COPY . .
WORKDIR "/src/VoroLp.API"
RUN dotnet build "VoroLp.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "VoroLp.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "VoroLp.API.dll"]
