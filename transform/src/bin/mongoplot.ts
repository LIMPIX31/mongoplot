#!/usr/bin/env node

import { Cli }     from 'clipanion'
import { Command } from 'clipanion'
import { Option }  from 'clipanion'
// @ts-expect-error
const { default: pnpapi } = await import('pnpapi')

const resolve = (what: string) => pnpapi.resolveRequest(what, process.cwd())

const [node, app, ...args] = process.argv

const cli = new Cli({
	binaryLabel: `Mongoplot`,
	binaryName: `${node} ${app}`,
	binaryVersion: `1.0.0`,
})

class PrintCommand extends Command {
	static paths = [['print']]

	mod = Option.String({ required: true })

	outfile = Option.String({ required: false })

	async execute() {
		resolve('vite-node')

		const config = resolve('mongoplot/vite-print-config')
		const print = resolve('mongoplot/print')

		await this.cli.run([
			'vite-node',
			'-c',
			config,
			'--mode',
			`${JSON.stringify({ mod: resolve(this.mod), outfile: this.outfile })}`,
			print,
		])
	}
}

class ServeCommand extends Command {
	static paths = [['serve']]

	file = Option.String({ required: true })

	async execute() {
		resolve('vite')

		const config = resolve('mongoplot/vite-serve-config')

		await this.cli.run(['vite', '-c', config, '--mode', `${JSON.stringify({ file: this.file })}`])
	}
}

cli.register(PrintCommand)
cli.register(ServeCommand)
cli.runExit(args)
