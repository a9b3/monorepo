package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/iancoleman/strcase"
	cp "github.com/otiai10/copy"
	cli "github.com/urfave/cli/v2"
)

// GitRevParseShowTopLevel
func GitRevParseShowTopLevel() (string, error) {
	path, err := exec.Command("git", "rev-parse", "--show-toplevel").Output()
	if err != nil {
		return "", err
	}
	return strings.TrimSpace(string(path)), nil
}

// GetExecutablePath returns the file path of the current executable.
func GetExecutablePath() (string, error) {
	ex, err := os.Executable()
	if err != nil {
		return "", err
	}
	exPath := filepath.Dir(ex)
	return exPath, nil
}

// FileExists checks if given filepath exists.
func FileExists(fp string) bool {
	if _, err := os.Stat(fp); !os.IsNotExist(err) {
		return true
	}
	return false
}

func ReplaceTextInFile(fp string, from string, to string) error {
	read, err := ioutil.ReadFile(fp)
	if err != nil {
		return err
	}

	newContents := strings.Replace(string(read), from, to, -1)

	err = ioutil.WriteFile(fp, []byte(newContents), 0)
	if err != nil {
		return err
	}

	return nil
}

// TemplateActionHandler is function supplied to Command Action.
func TemplateActionHandler(cCtx *cli.Context, templateName string) error {
	projectdir := cCtx.Args().Get(0)

	if projectdir == "" {
		log.Fatal("A name must be supplied as the last argument (ex. scaffold <template> <name>).")
	}

	path, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}
	outputDir := filepath.Join(path, projectdir)

	if FileExists(outputDir) {
		log.Fatalf("Cannot create in directory %s already exists", outputDir)
	}

	exPath, _ := GetExecutablePath()
	templateDir := filepath.Join(exPath, "../templates", templateName)

	if !FileExists(templateDir) {
		log.Fatalf("%s template does not exist", templateName)
	}

	fmt.Printf("Copying %s into %s\n", templateName, outputDir)
	err = cp.Copy(templateDir, outputDir)
	if err != nil {
		log.Fatal(err)
	}

	projectRoot, err := GitRevParseShowTopLevel()
	relativeFromProjectRoot := strings.Replace(outputDir, projectRoot+"/", "", -1)
	replacePath := strings.Replace(relativeFromProjectRoot, projectdir, "", -1)

	if err != nil {
		log.Fatal(err)
	}

	err = filepath.Walk(outputDir, func(path string, info os.FileInfo, err error) error {
		if info.IsDir() {
			return nil
		}

		for _, s := range [][]string{
			{strcase.ToCamel(templateName), projectdir},
			{strcase.ToKebab(templateName), projectdir},
			{strcase.ToSnake(templateName), projectdir},
			{"repos/scaffold/templates/", replacePath},
		} {
			err = ReplaceTextInFile(path, s[0], s[1])
			if err != nil {
				return err
			}
		}

		return nil
	})
	if err != nil {
		log.Fatal(err)
	}

	return nil
}

func main() {
	// Remove the timestamp prefix for the default go log commands, since we are
	// using this to display cli messages.
	log.SetFlags(0)

	app := &cli.App{
		Usage: "Create starter project directories.",
		Commands: []*cli.Command{
			{
				Name:     "svelte-template",
				Category: "template",
				Action: func(cCtx *cli.Context) error {
					return TemplateActionHandler(cCtx, "svelte-template")
				},
			},
			{
				Name:     "go-lib-template",
				Category: "template",
				Action: func(cCtx *cli.Context) error {
					return TemplateActionHandler(cCtx, "go-lib-template")
				},
			},
		},
	}

	if err := app.Run(os.Args); err != nil {
		log.Fatal(err)
	}
}
