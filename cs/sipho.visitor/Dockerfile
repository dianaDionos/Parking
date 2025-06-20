ARG DOTNET_VERSION=8.0
ARG BUILD_CONFIGURATION=Release
ARG BUILD_PLATFORM=linux-musl-x64

# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:"${DOTNET_VERSION}" AS build
WORKDIR /src
COPY ["sipho.visitor/sipho.visitor.csproj", "sipho.visitor/"]
RUN dotnet restore "sipho.visitor/sipho.visitor.csproj"
COPY . .
WORKDIR "/src/sipho.visitor"
RUN dotnet build "sipho.visitor.csproj" -c "${BUILD_CONFIGURATION}" -o /app/build

# Stage 2: Publish the application
FROM build AS publish
RUN dotnet publish "sipho.visitor.csproj" -c "${BUILD_CONFIGURATION}" -o /app/publish -r "${BUILD_PLATFORM}" /p:UseAppHost=false

# Stage 3: Create the final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:"${DOTNET_VERSION}-alpine" AS runtime
# update the package index
RUN apk update
# install icu-libs for globalization support
RUN apk add --no-cache icu-libs
# RUN apk add --no-cache icu-data-full

WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "sipho.visitor.dll"]