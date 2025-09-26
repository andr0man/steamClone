# Learn about building .NET container images:
# https://github.com/dotnet/dotnet-docker/blob/main/samples/README.md
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

# copy csproj and restore as distinct layers
COPY ["SteamClone.Domain/SteamClone.Domain.csproj", "SteamClone.Domain/"]
COPY ["SteamClone.DAL/SteamClone.DAL.csproj", "SteamClone.DAL/"]
COPY ["SteamClone.BLL/SteamClone.BLL.csproj", "SteamClone.BLL/"]
COPY ["SteamClone.API/SteamClone.API.csproj", "SteamClone.API/"]
RUN dotnet restore "SteamClone.API/SteamClone.API.csproj"

# copy everything else and build app
COPY . .
WORKDIR /source/SteamClone.API
RUN dotnet publish -o /app


# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
ENTRYPOINT ["dotnet", "SteamClone.API.dll"]