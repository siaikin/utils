type ParseredURL = {
  protocol: string,
  hostname: string,
  port: string,
  host: string,
  isSecurity: boolean
};

/**
 * 解析URL
 * @param {string} str
 */
export function parse(str: string): ParseredURL {
  str = str.replace('://', ':');

  let   offset = [str.indexOf(':')];
  const res: Partial<ParseredURL> = {},
        protocolIndex = [0, offset[0]],
        hostnameIndex = [0, 0],
        portIndex = [0, 0];

  offset.push(str.indexOf(':', offset[0] + 1), str.indexOf('/', offset[0] + 4), str.indexOf('?'), str.indexOf('#'), str.length);
  offset = offset.filter(i => i > 0).sort((a, b) => a - b);
  hostnameIndex[0] = protocolIndex[1] + 1;
  hostnameIndex[1] = offset[1];
  if (str.indexOf(':', offset[0] + 1) !== -1) {
    portIndex[0] = hostnameIndex[1] + 1;
    portIndex[1] = offset[2] || portIndex[0];
  }

  res.protocol = str.slice(...protocolIndex);
  res.hostname = str.slice(...hostnameIndex);
  res.port     = str.slice(...portIndex);
  res.host       = `${res.hostname}${res.port.length <= 0 ? '' : (':' + res.port)}`;
  res.isSecurity = res.protocol[res.protocol.length - 1] === 's';

  return res as ParseredURL;
}

export function parseToServerInfo(url: string): ServerInfo {
  const temp = parse(url);

  return {
    host: temp.host,
    hostname: temp.hostname,
    port: Number.parseInt(temp.port),
    security: temp.isSecurity,
    httpAddress: `http${temp.isSecurity ? 's' : ''}://${temp.host}`,
    wsAddress: `ws${temp.isSecurity ? 's' : ''}://${temp.host}`
  };
}

export function isIpAddress(hostname: string): boolean {
  const parts = hostname.split('.');
  if (parts.length !== 4) return false;

  for (let i = parts.length; i--;)
    if (!/^\d*$/.test(parts[i])) return false;

  return true;
}

export interface ServerInfo {
  host: string;
  hostname: string;
  port: number;
  security: boolean;
  httpAddress: string;
  wsAddress: string;
}
