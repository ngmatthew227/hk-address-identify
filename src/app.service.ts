import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private readonly pythonScriptPath = '/app/address_parser_nlp/main.py';
  getHello(): string {
    return 'Hello World!';
  }

  async parseAddress(address: string[]): Promise<string> {
    this.logger.log(`address: ${address}`);
    let result = '';
    try {
      const addressStr = address.map((addr) => `"${addr}"`).join(' ');
      const command = `python ${this.pythonScriptPath} -address ${addressStr}`;
      this.logger.log(`Command: ${command}`);

      const execPromise = promisify(exec);
      const { stdout, stderr } = await execPromise(command);

      if (stdout) {
        this.logger.log(`Output: ${stdout}`);
        result += stdout;
      }
      if (stderr) {
        this.logger.error(`Error: ${stderr}`);
      }
    } catch (error) {
      this.logger.error('Error executing command', error);
    }
    return result;
  }
}
