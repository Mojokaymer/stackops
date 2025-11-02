# Lokka MCP Server Setup

Lokka is a Model Context Protocol (MCP) server for Microsoft Graph operations.

## Installation

Lokka has been added to your MCP configuration as `Lokka-Microsoft`.

### Start Lokka MCP Server

1. Open Command Palette: `Ctrl + Shift + P` (or `Cmd + Shift + P` on Mac)
2. Type `MCP: List Servers`
3. Select `Lokka-Microsoft`
4. Select `Start Server`
5. A browser window will open - sign into your Microsoft tenant

## Authentication Options

### Option 1: Interactive (User Authentication)
- Default method when starting the MCP server
- Browser window opens for authentication
- Good for development and testing
- Requires user interaction each time

### Option 2: App-Only (Certificate-based)
For production or automated scenarios, use app-only authentication.

#### Step 1: Create Azure AD App Registration

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory** → **App registrations** → **New registration**
3. Name: `StackOps Lokka Worker`
4. Supported account types: **Accounts in this organizational directory only**
5. Click **Register**
6. Note the **Application (client) ID** and **Directory (tenant) ID**

#### Step 2: Generate Certificate

```bash
# Generate a self-signed certificate for authentication
openssl req -x509 -newkey rsa:2048 -keyout .lokka/cert-key.pem -out .lokka/cert.pem -days 365 -nodes
```

Or on Windows with PowerShell:
```powershell
$cert = New-SelfSignedCertificate -Subject "CN=StackOps Lokka" -CertStoreLocation "Cert:\CurrentUser\My" -KeyExportPolicy Exportable -KeySpec Signature -KeyLength 2048 -KeyAlgorithm RSA -HashAlgorithm SHA256
$pwd = ConvertTo-SecureString -String "password" -Force -AsPlainText
Export-PfxCertificate -Cert $cert -FilePath ".lokka/cert.pfx" -Password $pwd
Export-Certificate -Cert $cert -FilePath ".lokka/cert.cer"
```

#### Step 3: Upload Certificate to Azure

1. In your App Registration, go to **Certificates & secrets**
2. Click **Upload certificate**
3. Select `.lokka/cert.cer` or `.lokka/cert.pem`
4. Note the **Thumbprint** value

#### Step 4: Configure API Permissions

1. Go to **API permissions** → **Add a permission**
2. Select **Microsoft Graph** → **Application permissions**
3. Add these permissions:
   - `User.ReadWrite.All` - Create and manage users
   - `Group.ReadWrite.All` - Manage groups and memberships
   - `Directory.Read.All` - Read directory data
   - `Organization.Read.All` - Read organization and licenses
   - `Directory.AccessAsUser.All` (if needed for certain actions)
4. Click **Grant admin consent for [Your Tenant]** (requires Global Admin)
5. Wait for all permissions to show ✓ (green check)

#### Step 5: Configure Lokka

Update `.lokka/config.json` with your values:

```json
{
  "auth": {
    "type": "certificate",
    "tenantId": "YOUR_TENANT_ID_GUID",
    "clientId": "YOUR_CLIENT_ID_GUID",
    "certificatePath": "./.lokka/cert.pem",
    "certificateThumbprint": "YOUR_CERT_THUMBPRINT"
  },
  "graph": {
    "authorityHost": "https://login.microsoftonline.com",
    "resource": "https://graph.microsoft.com",
    "baseUrl": "https://graph.microsoft.com/v1.0"
  },
  "defaults": {
    "usageLocation": "FR"
  }
}
```

## Microsoft Graph Permissions Required

| Permission | Type | Reason |
|------------|------|--------|
| `User.ReadWrite.All` | Application | Create, update, disable users |
| `Group.ReadWrite.All` | Application | Add users to groups |
| `Organization.Read.All` | Application | Read available licenses |
| `Directory.Read.All` | Application | Read directory information |

## Usage with Worker

The worker communicates with Lokka via MCP to execute Microsoft Graph operations.

### Available Operations

1. **Create User** (`graph.users.create`)
   ```json
   {
     "userPrincipalName": "john.doe@contoso.com",
     "displayName": "John Doe",
     "mailNickname": "john.doe",
     "passwordProfile": {
       "password": "SecureP@ssw0rd!",
       "forceChangePasswordNextSignIn": true
     },
     "usageLocation": "US"
   }
   ```

2. **Add User to Group** (`graph.groups.addMember`)
   ```json
   {
     "group": "Sales-Team",
     "userPrincipalName": "john.doe@contoso.com"
   }
   ```

3. **Assign License** (`graph.licenses.assign`)
   ```json
   {
     "userPrincipalName": "john.doe@contoso.com",
     "skus": ["O365_BUSINESS_PREMIUM"]
   }
   ```

4. **Disable User** (`graph.users.disable`)
   ```json
   {
     "userPrincipalName": "john.doe@contoso.com"
   }
   ```

## Testing Lokka Connection

### From Cursor

1. Open Command Palette: `Ctrl + Shift + P`
2. Type `MCP: List Tools`
3. You should see Lokka tools listed

### From Worker

Once Lokka MCP server is running and authenticated:
```bash
cd apps/worker
npm run dev
```

The worker will connect to Lokka via MCP to execute operations.

## Troubleshooting

### "MCP server not found"
- Restart VS Code / Cursor
- Check `.cursor/mcp.json` has `Lokka-Microsoft` entry
- Try `MCP: Restart All Servers`

### "Authentication failed"
- Verify tenant ID and client ID are correct
- Check certificate is uploaded to Azure
- Ensure admin consent was granted for all permissions

### "Insufficient privileges"
- Grant admin consent in Azure Portal
- Wait 5-10 minutes for permissions to propagate
- Check that application permissions (not delegated) are used

### "Certificate not found"
- Verify `.lokka/cert.pem` exists
- Check certificate path in `config.json`
- Ensure certificate hasn't expired

## Security Notes

- **Never commit certificates or secrets to git**
- `.lokka/cert.pem` is in `.gitignore`
- Use different certificates for dev/staging/production
- Rotate certificates before expiration
- Use Azure Key Vault in production

## Next Steps

1. ✅ Lokka added to MCP configuration
2. ⏳ Start Lokka MCP server (see above)
3. ⏳ Authenticate with Microsoft tenant
4. ⏳ (Optional) Configure app-only auth for production
5. ⏳ Test operations via worker

## References

- [Lokka GitHub](https://github.com/merill/lokka)
- [Microsoft Graph API](https://docs.microsoft.com/graph/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Azure App Registration](https://docs.microsoft.com/azure/active-directory/develop/quickstart-register-app)

